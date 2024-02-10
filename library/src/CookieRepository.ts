import { CookieAttributes, Cookies } from './cookie-at-bleeding-edge';
import { CookieConfiguration, CookieHeaders, Tokens } from './types';

// TODO: Refactor Further...
export interface CookieRepository {
  getAccessTokenCookie(): string;
  getIdTokenCookie(): string;
  getRefreshTokenCookie(): string;

  createCookies(domain: string, tokens: Tokens): string[];

  parseCookies(cookieHeaders: CookieHeaders): Tokens;
}

export class DefaultCookieRepository implements CookieRepository {
  constructor(
    private readonly cookieConfiguration: CookieConfiguration,
  ) {}

  getAccessTokenCookie = () => 'cloudfront.accessToken';
  getIdTokenCookie = () => 'cloudfront.idToken';
  getRefreshTokenCookie = () => 'cloudfront.refreshToken';

  createCookies = (domain: string, tokens: Tokens): string[] => {
    const cookieAttributes: CookieAttributes = {
      domain: this.cookieConfiguration.disableDomain ? undefined : domain,
      expires: new Date(Date.now() + this.cookieConfiguration.expirationDays * 864e+5),
      httpOnly: this.cookieConfiguration.httpOnly,
      path: this.cookieConfiguration.path,
      sameSite: this.cookieConfiguration.sameSite,
      secure: true,
    };

    // TODO: Remove Me! `(tokens.accessToken || '')`
    const accessToken = Cookies.serialize(`${this.getAccessTokenCookie()}`, tokens.accessToken || '', cookieAttributes);
    // TODO: Remove Me! `(tokens.idToken || '')`
    const idToken = Cookies.serialize(`${this.getIdTokenCookie()}`, tokens.idToken || '', cookieAttributes);

    // TODO: Review Me!
    if (tokens.refreshToken) {
      const refreshToken = Cookies.serialize(`${this.getRefreshTokenCookie()}`, tokens.refreshToken, cookieAttributes);

      return [
        accessToken,
        idToken,
        refreshToken,
      ];
    } else {
      return [
        accessToken,
        idToken,
      ];
    }
  }

  parseCookies = (cookieHeaders: CookieHeaders): Tokens => {
    const cookies = (cookieHeaders || []).flatMap((header) => Cookies.parse(header.value));

    const tokens: Tokens = {};

    for (const {name, value} of cookies) {
      tokens.accessToken = (name === this.getAccessTokenCookie()) ? value : tokens.accessToken;
      tokens.idToken = (name === this.getIdTokenCookie()) ? value : tokens.idToken;
      tokens.refreshToken = (name === this.getRefreshTokenCookie()) ? value : tokens.refreshToken;
    }

    return tokens;
  }
}