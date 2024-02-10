
import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { CloudFrontRequestEvent } from 'aws-lambda/trigger/cloudfront-request';

import { Authenticator } from '../src/Authenticator';
import { DefaultCloudFrontResponseBuilder } from '../src/CloudFrontResponseBuilder';
import { CognitoClient, DefaultCognitoClient } from '../src/CognitoClient';
import { DefaultCognitoRequestBuilder } from '../src/CognitoRequestBuilder';
import { CognitoTokenVerifierFactory, } from '../src/CognitoVerifierFactory';
import { DefaultCookieRepository } from '../src/CookieRepository';
import { DefaultAuthenticator } from '../src/DefaultAuthenticator';
import { Logger } from '../src/Logger';
import { CognitoConfiguration, CookieConfiguration, Tokens } from '../src/types';
import { createEventWithCookies, createEventWithoutCookies, createEventWithQuery } from './fixtures/event';



class NOOPLogger implements Logger {
    debug(...args: any): void {}
    error(...args: any): void {}
    info(...args: any): void {}
}

class MockCognitoTokenVerifierFactory implements CognitoTokenVerifierFactory {
    constructor(
        private readonly cognitoConfiguration: CognitoConfiguration,
    ) {}

    // @ts-ignore
    createAccessTokenVerifier(): CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties> {
        return {
            verify: async (accessToken: string) => {
                if (accessToken === 'mockAccessToken') return Promise.resolve();
                else return Promise.reject();
            }
        };
    }

    // @ts-ignore
    createIdTokenVerifier(): CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties> {
        return {
            verify: async (idToken: string) => {
                if (idToken === 'mockIdToken') return Promise.resolve();
                else return Promise.reject();
            }
        };
    }
}

class MockCognitoClient implements CognitoClient {
    constructor(
        private readonly cognitoConfiguration: CognitoConfiguration,
        private readonly logger: Logger,
    ) {}

    postAuthorizationCodeExchange(redirectURI: string, code: string): Promise<Tokens> {
        if (code === 'mockAuthorizationCode') {
            return Promise.resolve({
                accessToken: 'mockAccessToken',
                idToken: 'mockIdToken',
                refreshToken: 'mockRefreshToken',
            });
        } else if (code === 'mockMalformedAuthorizationCode') {
            // Empty Token Response
            return Promise.resolve({});
        } else return Promise.reject();
    }

    postRefreshTokenExchange(redirectURI: string, refreshToken: string): Promise<any> {
        if (refreshToken === 'mockRefreshToken') {
            return Promise.resolve({
                accessToken: 'mockAccessToken',
                idToken: 'mockIdToken',
            });
        } else if (refreshToken === 'mockMalformedRefreshToken') {
            // Empty Token Response
            return Promise.resolve({});
        } else return Promise.reject();
    }
}



describe('Authenticator', () => {
    let authenticator: Authenticator;

    beforeEach(() => {
        jest
            .useFakeTimers()
            .setSystemTime(new Date('2023-10-20'));

        const cognitoConfiguration: CognitoConfiguration = {
            userPoolId: 'us-east-1_abcdef123',
            userPoolAppId: '123456789qwertyuiop987abcd',
            userPoolAppSecret: undefined,
            userPoolDomain: 'mock-cognito-domain.auth.us-east-1.amazoncognito.com',    
        };
        const cookieConfiguration: CookieConfiguration = DefaultAuthenticator.buildCookieConfiguration(undefined);
    
        // NOTE: Mocked to prevent network calls in tests...
        // NOTE: Mocked to simulate behaviors (good token, bad token) with mocked data...
        //  SEE: `MockCognitoTokenVerifierFactory`
        const cognitoTokenVerifierFactory: CognitoTokenVerifierFactory = new MockCognitoTokenVerifierFactory(
          cognitoConfiguration,
        );
    
        // NOTE: Mocked to prevent console output in tests...
        const defaultLogger: Logger = new NOOPLogger();
    
        authenticator = new Authenticator(
          new DefaultCloudFrontResponseBuilder(),
          // NOTE: Mocked to prevent network calls in tests...
          // NOTE: Mocked to simulate behaviors (good request, bad request) with mocked data...
          //    See: `MockCognitoClient`
          new MockCognitoClient(
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
    });

    test('handle / missing access tokens', async () => {
        // Missing access token should trigger a redirect to Cognito for authentication.
        const event = createEventWithCookies({ cookie: 'cloudfront.idToken=mockIdToken' });

        const response = await authenticator.handle(event as CloudFrontRequestEvent);

        expect(response).toBeDefined();
        expect(response).toMatchSnapshot();
    });

    test('handle / missing id tokens', async () => {
        // Misisng id token should trigger a redirect to Cognito for authentication.
        const event = createEventWithCookies({ cookie: 'cloudfront.accessToken=mockAccessToken' });

        const response = await authenticator.handle(event as CloudFrontRequestEvent);

        expect(response).toBeDefined();
        expect(response).toMatchSnapshot();
    });

    test('handle / invalid accessToken', async () => {
        // Invalid access token should trigger a redirect to Cognito for authentication.
        const event = createEventWithCookies({ cookie: 'cloudfront.accessToken=invalidAccessToken; cloudfront.idToken=mockIdToken' });

        const response = await authenticator.handle(event as CloudFrontRequestEvent);

        expect(response).toBeDefined();
        expect(response).toMatchSnapshot();
    });

    test('handle / invalid idToken', async () => {
        // Invalid ID token should trigger a redirect to Cognito for authentication.
        const event = createEventWithCookies({ cookie: 'cloudfront.accessToken=mockAccessToken; cloudfront.idToken=invalidIdToken' });

        const response = await authenticator.handle(event as CloudFrontRequestEvent);

        expect(response).toBeDefined();
        expect(response).toMatchSnapshot();
    });

    test('handle / redirect to cognito', async () => {
        // Cookie-less event should trigger a redirect to Cognito for authentication.
        const event = createEventWithoutCookies({});

        const response = await authenticator.handle(event as CloudFrontRequestEvent);

        expect(response).toBeDefined();
        expect(response).toMatchSnapshot();
    });

    test('handle / refresh token exchange', async () => {
        // Missing access token, id token should trigger an redirect with `Set-Cookie` headers
        const event = createEventWithCookies({ cookie: 'cloudfront.refreshToken=mockRefreshToken' });

        const response = await authenticator.handle(event as CloudFrontRequestEvent);

        expect(response).toBeDefined();
        expect(response).toMatchSnapshot();
    });

    test('handle / refresh token exchange, invalid refresh token', async () => {
        // Invalid refresh token should trigger an error
        // Error should trigger a redirect to Cognito for authentication.
        const event = createEventWithCookies({ cookie: 'cloudfront.refreshToken=mockInvalidRefreshToken' });

        const response = await authenticator.handle(event as CloudFrontRequestEvent);

        expect(response).toBeDefined();
        expect(response).toMatchSnapshot();
    });

    // TODO: Review Me!
    // test('handle / refresh token exchange, malformed response', async () => {
    //     // Malformed refresh token should trigger an malformed response from the Cognito mock
    //     //  Malformed response should trigger an error
    //     //  Error should trigger an 
    //     const event = createEventWithCookies({ cookie: 'cloudfront.refreshToken=mockMalformedRefreshToken' });

    //     const response = await authenticator.handle(event as CloudFrontRequestEvent);

    //     expect(response).toBeDefined();
    //     console.log(JSON.stringify(response, null, 4))
    //     // expect(response).toMatchSnapshot();
    // });

    test('handle / authorization code exchange', async () => {
        // Event with authorization code query parameter should trigger an redirect with `Set-Cookie` headers
        const event = createEventWithQuery({ query: 'code=mockAuthorizationCode' });

        const response = await authenticator.handle(event as CloudFrontRequestEvent);

        expect(response).toBeDefined();
        expect(response).toMatchSnapshot();
    });

    // TODO: Review Me!
    // test('handle / authorization code exchange, invalid authorization code', async () => {
    //     // Invalid authorization code should trigger an error
    //     const event = createEventWithQuery({ query: 'code=mockInvalidAuthorizationCode' });

    //     const response = await authenticator.handle(event as CloudFrontRequestEvent);

    //     expect(response).toBeDefined();
    //     expect(response).toMatchSnapshot();
    // });

    // test('handle / authorization code, malformed response', async () => {
    //     // Event with authorization code query parameter should trigger an redirect with `Set-Cookie` headers
    //     const event = createEventWithQuery({ query: 'code=mockMalformedAuthorizationCode' });

    //     const response = await authenticator.handle(event as CloudFrontRequestEvent);

    //     expect(response).toBeDefined();
    //     console.log(JSON.stringify(response, null, 4));
    //     // expect(response).toMatchSnapshot();
    // });

    test('handle / forward to distribution', async () => {
        // Valid access, identity tokens should allow the original request to be forwarded.
        const event = createEventWithCookies({ cookie: 'cloudfront.accessToken=mockAccessToken; cloudfront.idToken=mockIdToken' });

        const response = await authenticator.handle(event as CloudFrontRequestEvent);

        expect(response).toBeDefined();
        expect(response).toMatchSnapshot();
    });
});
