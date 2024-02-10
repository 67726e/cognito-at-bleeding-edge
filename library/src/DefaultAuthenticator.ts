import { CloudFrontRequestEvent, CloudFrontRequestResult } from "aws-lambda";
import { Authenticator, DefaultAuthenticatorConfiguration, DefaultAuthenticatorCookieConfiguration } from "./Authenticator";
import { DefaultCloudFrontResponseBuilder } from "./CloudFrontResponseBuilder";
import { DefaultCognitoClient } from "./CognitoClient";
import { DefaultCognitoRequestBuilder } from "./CognitoRequestBuilder";
import { CognitoTokenVerifierFactory, DefaultCognitoTokenVerifierFactory } from "./CognitoVerifierFactory";
import { SAME_SITE_VALUES } from "./cookie-at-bleeding-edge";
import { DefaultCookieRepository } from "./CookieRepository";
import { Logger, DefaultLogger } from "./Logger";
import { CognitoConfiguration, CookieConfiguration } from "./types";

export class DefaultAuthenticator {
    private authenticator;

    constructor(
        configuration: DefaultAuthenticatorConfiguration,
    ) {
        const cognitoConfiguration: CognitoConfiguration = configuration.cognitoConfiguration;
        const cookieConfiguration: CookieConfiguration = DefaultAuthenticator.buildCookieConfiguration(configuration.cookieConfiguration);

        const cognitoTokenVerifierFactory: CognitoTokenVerifierFactory = new DefaultCognitoTokenVerifierFactory(
            cognitoConfiguration,
        );

        const defaultLogger: Logger = new DefaultLogger();

        this.authenticator = new Authenticator(
            new DefaultCloudFrontResponseBuilder(),
            new DefaultCognitoClient(
                cognitoConfiguration,
                defaultLogger,
            ),
            new DefaultCognitoRequestBuilder(
                cognitoConfiguration,
            ),
            new DefaultCookieRepository(
                cookieConfiguration,
            ),
            defaultLogger,
            cognitoTokenVerifierFactory.createAccessTokenVerifier(),
            cognitoTokenVerifierFactory.createIdTokenVerifier(),
        );
    }

    static buildCookieConfiguration(cookieConfiguration?: DefaultAuthenticatorCookieConfiguration): CookieConfiguration {
        return {
            // TODO: Review Default!
            disableDomain: (cookieConfiguration && typeof cookieConfiguration.disableDomain === 'boolean') ? cookieConfiguration.disableDomain : false,
            // TODO: Review Default!
            expirationDays: (cookieConfiguration && typeof cookieConfiguration.expirationDays === 'number') ? cookieConfiguration.expirationDays : 365,
            // TODO: Review Default!
            httpOnly: (cookieConfiguration && typeof cookieConfiguration.httpOnly === 'boolean') ? cookieConfiguration.httpOnly : undefined,
            // We must intentionally set the `cookiePath` to `/`, providing access to all paths on the domain.
            // Otherwise, the path appears set by the browser(?) and results in duplicate cookies and a redirect loop.
            // See: https://github.com/awslabs/cognito-at-edge/issues/69
            path: (cookieConfiguration && typeof cookieConfiguration.path === 'string') ? cookieConfiguration.path : '/',
            // TODO: Review Default!
            sameSite: (cookieConfiguration && cookieConfiguration.sameSite !== undefined && SAME_SITE_VALUES.includes(cookieConfiguration.sameSite)) ? cookieConfiguration.sameSite : undefined,
        };
    }

    async handle(event: CloudFrontRequestEvent): Promise<CloudFrontRequestResult> {
        return this.authenticator.handle(event);
    }
}
