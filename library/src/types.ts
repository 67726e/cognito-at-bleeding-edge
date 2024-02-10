import { SameSite } from './cookie-at-bleeding-edge';

export type CookieHeaders = Array<{ key?: string | undefined, value: string }> | undefined;

export interface Tokens {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}

export interface CognitoConfiguration {
  userPoolId: string,
  userPoolAppId: string,
  userPoolAppSecret?: string,
  userPoolDomain: string,
}

export interface CookieConfiguration {
  disableDomain: boolean,
  expirationDays: number,
  httpOnly?: boolean,
  sameSite?: SameSite,
  path?: string,
}
