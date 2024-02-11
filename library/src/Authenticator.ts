import { CloudFrontRequest, CloudFrontRequestEvent, CloudFrontRequestResult } from 'aws-lambda';
import { parse } from 'querystring';

import { CloudFrontResponseBuilder, } from './CloudFrontResponseBuilder';
import { CognitoClient, } from './CognitoClient';
import { CognitoRequestBuilder, } from './CognitoRequestBuilder';
import { SameSite, SAME_SITE_VALUES } from './cookie-at-bleeding-edge';
import { CookieRepository, } from './CookieRepository';
import { Logger } from './Logger';
import { CognitoConfiguration, CookieHeaders, Tokens } from './types';

export type DefaultAuthenticatorCognitoConfiguration = CognitoConfiguration

export interface DefaultAuthenticatorCookieConfiguration {
  disableDomain?: boolean;
  expirationDays?: number;
  httpOnly?: boolean;
  sameSite?: SameSite;
  path?: string;
}

export interface DefaultAuthenticatorConfiguration {
  cognitoConfiguration: DefaultAuthenticatorCognitoConfiguration;
  cookieConfiguration?: DefaultAuthenticatorCookieConfiguration;
}

export type AuthenticatorResult = {
  actual: CloudFrontRequestResult,
  isAuthenticated: boolean,
};

export class Authenticator {
  constructor(
    private readonly cloudFrontResponseBuilder: CloudFrontResponseBuilder,
    private readonly cognitoClient: CognitoClient,
    private readonly cognitoRequestBuilder: CognitoRequestBuilder,
    private readonly cookieRepository: CookieRepository,
    private readonly logger: Logger,
    private readonly accessTokenVerifier: any,
    private readonly idTokenVerifier: any,
  ) {}

  /**
   * Extract value of the authentication token from the request cookies.
   * @param  {Array}  cookieHeaders 'Cookie' request headers.
   * @return {Tokens} Extracted id token or access token. Null if not found.
   */
  _getTokensFromCookie(cookieHeaders: CookieHeaders): Tokens {
    if (!cookieHeaders) {
      this.logger.debug("Cookies weren't present in the request");

      throw new Error("Cookies weren't present in the request");
    }

    this.logger.debug({ msg: 'Extracting authentication token from request cookie', cookieHeaders });

    const tokens: Tokens = this.cookieRepository.parseCookies(cookieHeaders);

    if (!tokens.accessToken && !tokens.idToken && !tokens.refreshToken) {
      this.logger.debug('Neither accessToken, idToken, nor refreshToken was present in request cookies');

      throw new Error('Neither accessToken, idToken, nor refreshToken was present in request cookies');
    }

    this.logger.debug({ msg: 'Found tokens in cookie', tokens });

    return tokens;
  }

  /**
   * Create a Lambda@Edge redirection response to set the tokens on the user's browser cookies.
   * @param  {Object} tokens   Cognito User Pool tokens.
   * @param  {String} domain   Website domain.
   * @param  {String} location Path to redirection.
   * @return Lambda@Edge response.
   */
  _createSetCookieRedirectResponse(tokens: Tokens, domain: string, location: string): CloudFrontRequestResult {
    const cookies = this.cookieRepository.createCookies(domain, tokens);

    const response: CloudFrontRequestResult = this.cloudFrontResponseBuilder.buildCookieRedirectResponse(location, cookies);

    this.logger.debug({ msg: 'Generated set-cookie response', response });

    return response;
  }

  /**
   * Get redirect to cognito userpool response
   * @param  {CloudFrontRequest}  request The original request
   * @param  {string}  redirectURI Redirection URI.
   * @return {CloudFrontRequestResult} Redirect response.
   */
  _createCognitoAuthorizationRedirectResponse(request: CloudFrontRequest, redirectURI: string): CloudFrontRequestResult {
    const redirectPath = (request.querystring && request.querystring !== '') ?
      request.uri + encodeURIComponent('?' + request.querystring) :
      request.uri;

    const userPoolUrl = this.cognitoRequestBuilder.buildAuthorizeRequest(redirectURI, redirectPath);

    this.logger.debug(`Redirecting user to Cognito User Pool URL ${userPoolUrl}`);

    return this.cloudFrontResponseBuilder.buildCognitoRedirectResponse(userPoolUrl);
  }

  /**
   * Handle Lambda@Edge event:
   *   * if authentication cookie is present and valid: forward the request
   *   * if authentication cookie is invalid, but refresh token is present: set cookies with refreshed tokens
   *   * if ?code=<grant code> is present: set cookies with new tokens
   *   * else redirect to the Cognito UserPool to authenticate the user
   * @param  {Object}  event Lambda@Edge event.
   * @return {Promise} CloudFront response.
   */
  async handle(event: CloudFrontRequestEvent): Promise<AuthenticatorResult> {
    this.logger.debug({ msg: 'Handling Lambda@Edge Event', event });

    const { request } = event.Records[0].cf;
    const requestParams = parse(request.querystring);
    const cloudFrontDomain = request.headers.host[0].value;
    const redirectURI = `https://${cloudFrontDomain}`;

    // 1. Get Token(s) from Cookie Header(s)
    //  Cookie(s) May or May Not Include: Access Token, ID Token, Refresh Token
    // 2. Verify Access Token, ID Token
    //  If Access Token and ID Token verify, return original request.
    //  If Access Token and or ID Token fail, next step 
    // 3. Fetch Token(s) from Refresh Token
    //  If Fetch Token(s) succeed, return redirect request w/ Access Token, ID Token as `Set-Cookie` Header
    //  If Fetch Token(s) fail, next step
    // 4. Get Authentication Code from Query Parameter(s), Exchange for Token(s)
    //  If Fetch Token(s) success, return redirect request w/ Access Token, ID Token as `Set-Cookie` Header
    //  If Fetch Token(s) fail, final failure
    // 5. Return Redirect to Cognito Authentication Pool

    try {
      // 1. Get Token(s) from Cookie Header(s)
      const tokens = this._getTokensFromCookie(request.headers.cookie);

      this.logger.debug({ msg: 'Verifying token...', tokens });

      try {
        // 2. Verify Access Token, ID Token
        const identity = await this.idTokenVerifier.verify(tokens.idToken);
        const access = await this.accessTokenVerifier.verify(tokens.accessToken);

        this.logger.info({ msg: 'Forwarding request', path: request.uri, identity, access });

        return { actual: request, isAuthenticated: true, };
      } catch (err) {
        // 3. Fetch Token(s) from Refresh Token
        if (tokens.refreshToken) {
          this.logger.debug({ msg: 'Verifying accessToken, idToken failed, verifying refresh token instead...', tokens, err });

          return await this.cognitoClient.postRefreshTokenExchange(redirectURI, tokens.refreshToken)
            .then(tokens => {
              const result = this._createSetCookieRedirectResponse(tokens, cloudFrontDomain, request.uri);

              return { actual: result, isAuthenticated: false, };
            });
        } else {
          throw err;
        }
      }
    } catch (err) {
      this.logger.debug("User isn't authenticated: %s", err);

      if (requestParams.code) {
        // 4. Get Authentication Code from Query Parameter(s), Exchange for Token(s)
        return await this.cognitoClient.postAuthorizationCodeExchange(redirectURI, requestParams.code as string)
          .then(tokens => {
            const result = this._createSetCookieRedirectResponse(tokens, cloudFrontDomain, requestParams.state as string);

            return { actual: result, isAuthenticated: false, };
          });
      } else {
        // 5. Return Redirect to Cognito Authentication Pool
        const result = this._createCognitoAuthorizationRedirectResponse(request, redirectURI);

        return { actual: result, isAuthenticated: false, };
      }
    }
  }
}
