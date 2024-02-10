import { CloudFrontRequestResult } from 'aws-lambda';

export interface CloudFrontResponseBuilder {
  buildCognitoRedirectResponse(location: string): CloudFrontRequestResult;
  buildCookieRedirectResponse(location: string, cookies: string[]): CloudFrontRequestResult;
}

export class DefaultCloudFrontResponseBuilder implements CloudFrontResponseBuilder {
  buildCognitoRedirectResponse(location: string): CloudFrontRequestResult {
    return {
      status: '302',
      headers: {
        'location': [{
          key: 'Location',
          value: location,
        }],
        'cache-control': [{
          key: 'Cache-Control',
          value: 'no-cache, no-store, max-age=0, must-revalidate',
        }],
        'pragma': [{
          key: 'Pragma',
          value: 'no-cache',
        }],
      },
    };
  }

  buildCookieRedirectResponse(location: string, cookies: string[]): CloudFrontRequestResult {
    return {
      status: '302' ,
      headers: {
        'location': [{
          key: 'Location',
          value: location,
        }],
        'cache-control': [{
          key: 'Cache-Control',
          value: 'no-cache, no-store, max-age=0, must-revalidate',
        }],
        'pragma': [{
          key: 'Pragma',
          value: 'no-cache',
        }],
        'set-cookie': cookies.map((cookie) => ({ key: 'Set-Cookie', value: cookie })),
      },
    };
  }
}
