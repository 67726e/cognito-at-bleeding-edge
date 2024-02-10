
import { beforeEach, describe, expect, test } from '@jest/globals'

import { CognitoRequestBuilder, DefaultCognitoRequestBuilder } from '../src/CognitoRequestBuilder';

describe('DefaultCognitoRequestBuilder', () => {
    let builder: CognitoRequestBuilder;

    beforeEach(() => {
        builder = new DefaultCognitoRequestBuilder({
            userPoolId: 'us-east-1_abcdef123',
            userPoolAppId: '123456789qwertyuiop987abcd',
            userPoolAppSecret: undefined,
            userPoolDomain: 'mock-cognito-domain.auth.us-east-1.amazoncognito.com',
        });
    });

    test('buildAuthorizeRequest', () => {
        const request = builder.buildAuthorizeRequest('https://mock.cloudfront.net', '/');

        // Sample Request (Chrome Network Inspector)
        //
        // Request URL: https://cloudfront-pool-domain.auth.us-east-1.amazoncognito.com/authorize
        //  ?client_id=1hoa20u57ikp7nafi8ks287uba
        //  &redirect_uri=https://d20o2ten651kje.cloudfront.net
        //  &response_type=code
        //  &state=/

        expect(request).toMatchSnapshot();
    });
});
