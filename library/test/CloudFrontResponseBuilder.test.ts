
import { beforeEach, describe, expect, test } from '@jest/globals'

import { CloudFrontResponseBuilder, DefaultCloudFrontResponseBuilder } from '../src/CloudFrontResponseBuilder';

describe('DefaultCloudFrontResponseBuilder', () => {
    let builder: CloudFrontResponseBuilder;

    beforeEach(() => {
        builder = new DefaultCloudFrontResponseBuilder();
    });

    test('buildCognitoRedirectResponse', () => {
        const response =  builder.buildCognitoRedirectResponse('https://cloudfront-pool-domain.auth.us-east-1.amazoncognito.com/authorize?client_id=1hoa20u57ikp7nafi8ks287uba&redirect_uri=https://d20o2ten651kje.cloudfront.net&response_type=code&state=/        ');

        // https://cloudfront-pool-domain.auth.us-east-1.amazoncognito.com/authorize?client_id=1hoa20u57ikp7nafi8ks287uba&redirect_uri=https://d20o2ten651kje.cloudfront.net&response_type=code&state=/

        expect(response).toMatchSnapshot();
    });

    test('buildCookieRedirectResponse', () => {
        const response =  builder.buildCookieRedirectResponse('', [
            'cloudfront.accessToken=MOCK_ACCESS_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Mon, 21 Oct 2024 20:28:19 GMT; Secure',
            'cloudfront.idToken=MOCK_ID_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Mon, 21 Oct 2024 20:28:19 GMT; Secure',
            'cloudfront.refreshToken=MOCK_REFRESH_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Mon, 21 Oct 2024 20:28:19 GMT; Secure',
        ]);

        // 'set-cookie: cloudfront.accessToken=MOCK_ACCESS_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Mon, 21 Oct 2024 20:28:19 GMT; Secure',
        // 'set-cookie: cloudfront.idToken=MOCK_ID_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Mon, 21 Oct 2024 20:28:19 GMT; Secure',
        // 'set-cookie: cloudfront.refreshToken=MOCK_REFRESH_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Mon, 21 Oct 2024 20:28:19 GMT; Secure',
    
        expect(response).toMatchSnapshot();
    });
});
