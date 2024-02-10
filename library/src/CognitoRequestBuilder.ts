import { CognitoConfiguration } from './types';

export interface CognitoRequestBuilder {
  buildAuthorizeRequest(redirectURI: string, redirectPath: string): string;
}

export class DefaultCognitoRequestBuilder implements CognitoRequestBuilder {
  constructor(
    private readonly cognitoConfiguration: CognitoConfiguration,
  ) {}

  buildAuthorizeRequest(redirectURI: string, redirectPath: string): string {
    const authorizeUrl = `https://${this.cognitoConfiguration.userPoolDomain}/authorize?` +
      `client_id=${this.cognitoConfiguration.userPoolAppId}&` + 
      `redirect_uri=${redirectURI}&` +
      'response_type=code&' +
      `state=${redirectPath}`;

    return authorizeUrl;
  }
}
