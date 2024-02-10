
import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import { CookieRepository, DefaultCookieRepository } from '../src/CookieRepository';

describe('DefaultCookieRepository', () => {
    let repository: CookieRepository;

    beforeEach(() => {
        jest
            .useFakeTimers()
            .setSystemTime(new Date('2023-10-20'));

        repository = new DefaultCookieRepository({
            disableDomain: false,
            expirationDays: 365,
            httpOnly: undefined,
            sameSite: undefined,
            path: '/',
        });
    });

    test('createCookies', () => {
        const cookies = repository.createCookies('d20o2ten651kje.cloudfront.net', {
            accessToken: 'MOCK_ACCESS_TOKEN',
            idToken: 'MOCK_ID_TOKEN',
            refreshToken: 'MOCK_REFRESH_TOKEN',
        });

        expect(cookies).toBeDefined();
        expect(cookies).toHaveLength(3);
        expect(cookies[0]).toEqual('cloudfront.accessToken=MOCK_ACCESS_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Sat, 19 Oct 2024 00:00:00 GMT; Secure');
        expect(cookies[1]).toEqual('cloudfront.idToken=MOCK_ID_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Sat, 19 Oct 2024 00:00:00 GMT; Secure');
        expect(cookies[2]).toEqual('cloudfront.refreshToken=MOCK_REFRESH_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Sat, 19 Oct 2024 00:00:00 GMT; Secure');
    });

    test('parseCookies', () => {
        const tokens = repository.parseCookies([
            { key: undefined, value: 'cloudfront.accessToken=MOCK_ACCESS_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Sat, 19 Oct 2024 00:00:00 GMT; Secure', },
            { key: undefined, value: 'cloudfront.idToken=MOCK_ID_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Sat, 19 Oct 2024 00:00:00 GMT; Secure', },
            { key: undefined, value: 'cloudfront.refreshToken=MOCK_REFRESH_TOKEN; Domain=d20o2ten651kje.cloudfront.net; Path=/; Expires=Sat, 19 Oct 2024 00:00:00 GMT; Secure', },
        ]);

        expect(tokens).toBeDefined();
        expect(tokens.accessToken).toEqual('MOCK_ACCESS_TOKEN');
        expect(tokens.idToken).toEqual('MOCK_ID_TOKEN');
        expect(tokens.refreshToken).toEqual('MOCK_REFRESH_TOKEN');
    });
});
