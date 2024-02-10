
// "value": "cloudfront.refreshToken=mockRefreshToken; cloudfront.accessToken=mockAccessToken; cloudfront.idToken=mockIdToken"

export const createEventWithCookies = ({ cookie }: { cookie: string }) => {
    return {
        "Records": [
            {
                "cf": {
                    "config": {
                        "distributionDomainName": "d20o2ten651kje.cloudfront.net",
                        "distributionId": "E1DHBHLKM2KNSG",
                        "eventType": "viewer-request",
                        "requestId": "yYMtR-D8af9C5Ns-g1TQ5HX_s81BUawgWii2t3zuMjiVVtVKOfUCIQ=="
                    },
                    "request": {
                        "clientIp": "12.34.567.890",
                        "headers": {
                            "host": [
                                {
                                    "key": "Host",
                                    "value": "d20o2ten651kje.cloudfront.net"
                                }
                            ],
                            "user-agent": [
                                {
                                    "key": "User-Agent",
                                    "value": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
                                }
                            ],
                            "cookie": [
                                {
                                    "key": "Cookie",
                                    "value": cookie,
                                }
                            ],
                            "cache-control": [
                                {
                                    "key": "cache-control",
                                    "value": "max-age=0"
                                }
                            ],
                            "upgrade-insecure-requests": [
                                {
                                    "key": "upgrade-insecure-requests",
                                    "value": "1"
                                }
                            ],
                            "accept": [
                                {
                                    "key": "accept",
                                    "value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
                                }
                            ],
                            "sec-gpc": [
                                {
                                    "key": "sec-gpc",
                                    "value": "1"
                                }
                            ],
                            "accept-language": [
                                {
                                    "key": "accept-language",
                                    "value": "en-US,en;q=0.9"
                                }
                            ],
                            "sec-fetch-site": [
                                {
                                    "key": "sec-fetch-site",
                                    "value": "none"
                                }
                            ],
                            "sec-fetch-mode": [
                                {
                                    "key": "sec-fetch-mode",
                                    "value": "navigate"
                                }
                            ],
                            "sec-fetch-user": [
                                {
                                    "key": "sec-fetch-user",
                                    "value": "?1"
                                }
                            ],
                            "sec-fetch-dest": [
                                {
                                    "key": "sec-fetch-dest",
                                    "value": "document"
                                }
                            ],
                            "accept-encoding": [
                                {
                                    "key": "accept-encoding",
                                    "value": "gzip, deflate, br"
                                }
                            ],
                            "if-none-match": [
                                {
                                    "key": "if-none-match",
                                    "value": "\"fdb8756628111e736d7f6b238664ae01\""
                                }
                            ],
                            "if-modified-since": [
                                {
                                    "key": "if-modified-since",
                                    "value": "Fri, 21 Jul 2023 14:52:55 GMT"
                                }
                            ]
                        },
                        "method": "GET",
                        "querystring": "",
                        "uri": "/"
                    }
                }
            }
        ]
    };
};

export const createEventWithoutCookies = ({}: {}) => {
    return {
        "Records": [
            {
                "cf": {
                    "config": {
                        "distributionDomainName": "d20o2ten651kje.cloudfront.net",
                        "distributionId": "E1DHBHLKM2KNSG",
                        "eventType": "viewer-request",
                        "requestId": "rAKdBATS-lc-8fwe7RkCMbajyRAHupuRo5yn0MZvmif99K1ZQr6PEA=="
                    },
                    "request": {
                        "clientIp": "12.34.567.890",
                        "headers": {
                            "host": [
                                {
                                    "key": "Host",
                                    "value": "d20o2ten651kje.cloudfront.net"
                                }
                            ],
                            "user-agent": [
                                {
                                    "key": "User-Agent",
                                    "value": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
                                }
                            ],
                            "cache-control": [
                                {
                                    "key": "cache-control",
                                    "value": "max-age=0"
                                }
                            ],
                            "upgrade-insecure-requests": [
                                {
                                    "key": "upgrade-insecure-requests",
                                    "value": "1"
                                }
                            ],
                            "accept": [
                                {
                                    "key": "accept",
                                    "value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
                                }
                            ],
                            "sec-gpc": [
                                {
                                    "key": "sec-gpc",
                                    "value": "1"
                                }
                            ],
                            "accept-language": [
                                {
                                    "key": "accept-language",
                                    "value": "en-US,en;q=0.9"
                                }
                            ],
                            "sec-fetch-site": [
                                {
                                    "key": "sec-fetch-site",
                                    "value": "none"
                                }
                            ],
                            "sec-fetch-mode": [
                                {
                                    "key": "sec-fetch-mode",
                                    "value": "navigate"
                                }
                            ],
                            "sec-fetch-user": [
                                {
                                    "key": "sec-fetch-user",
                                    "value": "?1"
                                }
                            ],
                            "sec-fetch-dest": [
                                {
                                    "key": "sec-fetch-dest",
                                    "value": "document"
                                }
                            ],
                            "accept-encoding": [
                                {
                                    "key": "accept-encoding",
                                    "value": "gzip, deflate, br"
                                }
                            ],
                            "if-none-match": [
                                {
                                    "key": "if-none-match",
                                    "value": "\"fdb8756628111e736d7f6b238664ae01\""
                                }
                            ],
                            "if-modified-since": [
                                {
                                    "key": "if-modified-since",
                                    "value": "Fri, 21 Jul 2023 14:52:55 GMT"
                                }
                            ]
                        },
                        "method": "GET",
                        "querystring": "",
                        "uri": "/"
                    }
                }
            }
        ]
    };
};

export const createEventWithQuery = ({ query }: { query: string }) => {
    return {
        "Records": [
            {
                "cf": {
                    "config": {
                        "distributionDomainName": "d20o2ten651kje.cloudfront.net",
                        "distributionId": "E1DHBHLKM2KNSG",
                        "eventType": "viewer-request",
                        "requestId": "rAKdBATS-lc-8fwe7RkCMbajyRAHupuRo5yn0MZvmif99K1ZQr6PEA=="
                    },
                    "request": {
                        "clientIp": "12.34.567.890",
                        "headers": {
                            "host": [
                                {
                                    "key": "Host",
                                    "value": "d20o2ten651kje.cloudfront.net"
                                }
                            ],
                            "user-agent": [
                                {
                                    "key": "User-Agent",
                                    "value": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
                                }
                            ],
                            "cache-control": [
                                {
                                    "key": "cache-control",
                                    "value": "max-age=0"
                                }
                            ],
                            "upgrade-insecure-requests": [
                                {
                                    "key": "upgrade-insecure-requests",
                                    "value": "1"
                                }
                            ],
                            "accept": [
                                {
                                    "key": "accept",
                                    "value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
                                }
                            ],
                            "sec-gpc": [
                                {
                                    "key": "sec-gpc",
                                    "value": "1"
                                }
                            ],
                            "accept-language": [
                                {
                                    "key": "accept-language",
                                    "value": "en-US,en;q=0.9"
                                }
                            ],
                            "sec-fetch-site": [
                                {
                                    "key": "sec-fetch-site",
                                    "value": "none"
                                }
                            ],
                            "sec-fetch-mode": [
                                {
                                    "key": "sec-fetch-mode",
                                    "value": "navigate"
                                }
                            ],
                            "sec-fetch-user": [
                                {
                                    "key": "sec-fetch-user",
                                    "value": "?1"
                                }
                            ],
                            "sec-fetch-dest": [
                                {
                                    "key": "sec-fetch-dest",
                                    "value": "document"
                                }
                            ],
                            "accept-encoding": [
                                {
                                    "key": "accept-encoding",
                                    "value": "gzip, deflate, br"
                                }
                            ],
                            "if-none-match": [
                                {
                                    "key": "if-none-match",
                                    "value": "\"fdb8756628111e736d7f6b238664ae01\""
                                }
                            ],
                            "if-modified-since": [
                                {
                                    "key": "if-modified-since",
                                    "value": "Fri, 21 Jul 2023 14:52:55 GMT"
                                }
                            ]
                        },
                        "method": "GET",
                        "querystring": query,
                        "uri": "/"
                    }
                }
            }
        ]
    };
};
