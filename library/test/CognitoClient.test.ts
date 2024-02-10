
import * as axios from 'axios';
import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { CognitoClient, DefaultCognitoClient } from '../src/CognitoClient';
import { Logger, } from '../src/Logger';

describe('DefaultCognitoClient', () => {
    let logger: Logger;
    let client: CognitoClient;

    beforeEach(() => {
        jest.resetAllMocks()
        jest.mock('axios');

        // @ts-ignore
        axios.request = jest.fn(() => Promise.resolve({
            data: {
                access_token: '',
                id_token: '',
                refresh_token: '',
            },
        }));

        logger = {
            debug: jest.fn(),
            error: jest.fn(),
            info: jest.fn(),
        };

        client = new DefaultCognitoClient(
            {
                userPoolId: 'us-east-1_abcdef123',
                userPoolAppId: '123456789qwertyuiop987abcd',
                userPoolAppSecret: undefined,
                userPoolDomain: 'mock-cognito-domain.auth.us-east-1.amazoncognito.com',
            },
            logger,
        );
    });

    test('postAuthorizationCodeExchange', async () => {
        // https://d20o2ten651kje.cloudfront.net/?code=27327374-1ee0-48ec-979b-e7c4cd8c33da&state=/
        const response = await client.postAuthorizationCodeExchange('/', '12345678-1aa2-12aa-123a-a1a1aa1a12aa');

        // @ts-ignore
        expect(axios.request).toHaveBeenCalledTimes(1);
    });

    test('postRefreshTokenExchange', async () => {
        // https://
        const response = client.postRefreshTokenExchange('/', 'mockRefreshToken');

        // @ts-ignore
        expect(axios.request).toHaveBeenCalledTimes(1);
    });
});
