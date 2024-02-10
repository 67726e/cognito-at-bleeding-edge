
import { beforeEach, describe, expect, test } from '@jest/globals'

import { CognitoTokenVerifierFactory, DefaultCognitoTokenVerifierFactory } from '../src/CognitoVerifierFactory';

describe('DefaultCognitoTokenVerifierFactory', () => {
    let factory: CognitoTokenVerifierFactory;

    beforeEach(() => {
        factory = new DefaultCognitoTokenVerifierFactory({
            userPoolId: 'us-east-1_abcdef123',
            userPoolAppId: '123456789qwertyuiop987abcd',
            userPoolAppSecret: undefined,
            userPoolDomain: 'mock-cognito-domain.auth.us-east-1.amazoncognito.com',
        });
    });

    test('createAccessTokenVerifier', () => {
        expect(factory.createAccessTokenVerifier()).toBeDefined();
    });

    test('createIdTokenVerifier', () => {
        expect(factory.createIdTokenVerifier()).toBeDefined();
    });
});
