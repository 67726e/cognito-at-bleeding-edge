import { CognitoJwtVerifier, CognitoJwtVerifierProperties, CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';
import { CognitoConfiguration } from './types';

export interface CognitoTokenVerifierFactory {
  createAccessTokenVerifier(): CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties>;
  createIdTokenVerifier(): CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties>;
}

export class DefaultCognitoTokenVerifierFactory implements CognitoTokenVerifierFactory {
  constructor(
    private readonly cognitoConfiguration: CognitoConfiguration,
  ) {}

  createAccessTokenVerifier() {
    return CognitoJwtVerifier.create({
      userPoolId: this.cognitoConfiguration.userPoolId,
      clientId: this.cognitoConfiguration.userPoolAppId,
      tokenUse: 'access',
    } as CognitoJwtVerifierProperties);
  }

  createIdTokenVerifier() {
    return CognitoJwtVerifier.create({
      userPoolId: this.cognitoConfiguration.userPoolId,
      clientId: this.cognitoConfiguration.userPoolAppId,
      tokenUse: 'id',
    } as CognitoJwtVerifierProperties);
  }
}
