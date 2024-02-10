import axios from 'axios';
import { stringify } from 'querystring';

import { Logger } from './Logger';
import { CognitoConfiguration, Tokens } from './types';

export interface CognitoClient {
  postAuthorizationCodeExchange(redirectURI: string, code: string): Promise<Tokens>;
  postRefreshTokenExchange(redirectURI: string, refreshToken: string): Promise<any>;
}

export class DefaultCognitoClient implements CognitoClient {
  constructor(
    private readonly cognitoConfiguration: CognitoConfiguration,
    private readonly logger: Logger,
  ) {}

  /**
   * Exchange Authorization Code for Access, ID, Refresh Tokens
   * @param  {String} redirectURI Redirection URI.
   * @param  {String} code        Authorization Code.
   * @return {Promise} Authorized User Tokens.
   */
  postAuthorizationCodeExchange(redirectURI: string, code: string): Promise<Tokens> {
    // TODO: Document Me! - Why Optional `userPoolAppStream`
    const authorization = this.cognitoConfiguration.userPoolAppSecret && Buffer.from(`${this.cognitoConfiguration.userPoolAppId}:${this.cognitoConfiguration.userPoolAppSecret}`).toString('base64');

    const request = {
      url: `https://${this.cognitoConfiguration.userPoolDomain}/oauth2/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(authorization && {'Authorization': `Basic ${authorization}`}),
      },
      data: stringify({
        client_id:	this.cognitoConfiguration.userPoolAppId,
        code:	code,
        grant_type:	'authorization_code',
        redirect_uri:	redirectURI,
      }),
    } as const;

    this.logger.debug({ msg: 'Fetching Tokens for Authorization Code', request, code });

    return axios.request(request)
      .then((response) => {
        this.logger.debug({ msg: 'Successfully Fetched Tokens for Authorization Code', tokens: response.data });

        // TODO: Validate / Assert Type!
        return {
          accessToken: response.data.access_token,
          idToken: response.data.id_token,
          refreshToken: response.data.refresh_token,
        };
      })
      .catch((error) => {
        this.logger.error({ msg: 'Failure Fetching Tokens for Authorization Code', request, code });

        throw error;
      });
  }

  /**
   * Exchange Refresh Token for Access, ID Tokens
   * @param  {String} redirectURI Redirection URI.
   * @param  {String} refreshToken Refresh Token.
   * @return {Promise<Tokens>} Refreshed User Tokens.
   */
  postRefreshTokenExchange(redirectURI: string, refreshToken: string) {
    // TODO: Document Me! - Why Optional `userPoolAppStream`
    const authorization = this.cognitoConfiguration.userPoolAppSecret && Buffer.from(`${this.cognitoConfiguration.userPoolAppId}:${this.cognitoConfiguration.userPoolAppSecret}`).toString('base64');

    const request = {
      url: `https://${this.cognitoConfiguration.userPoolDomain}/oauth2/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(authorization && {'Authorization': `Basic ${authorization}`}),
      },
      data: stringify({
        client_id: this.cognitoConfiguration.userPoolAppId,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        redirect_uri: redirectURI,
      }),
    } as const;

    this.logger.debug({ msg: 'Fetching Tokens for Refresh Token', request, refreshToken });

    return axios.request(request)
      .then((response) => {
        this.logger.debug({ msg: 'Successfully Fetched Tokens for Refresh Token', tokens: response.data });
        
        // TODO: Validate / Assert Type!
        return {
          accessToken: response.data.access_token,
          idToken: response.data.id_token,
          // TODO: Add `refreshToken` ???
        };
      })
      .catch((error) => {
        this.logger.error({ msg: 'Failure Fetching Tokens for Refresh Token', request, refreshToken });
        
        throw error;
      });
  }
}
