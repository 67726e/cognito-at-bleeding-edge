
import { CloudFrontRequestEvent, CloudFrontRequestResult } from 'aws-lambda';

import {
    USER_POOL_ID,
    USER_POOL_DOMAIN,
    USER_POOL_APP_CLIENT_ID,
    USER_POOL_APP_CLIENT_SECRET,
} from './configuration';

import { DefaultAuthenticator } from '../../../../library/src/';
// import { DefaultAuthenticator } from 'cognito-at-bleeding-edge';

const authenticator = new DefaultAuthenticator({
    cognitoConfiguration: {
        userPoolId: USER_POOL_ID,
        userPoolDomain: USER_POOL_DOMAIN,
        userPoolAppId: USER_POOL_APP_CLIENT_ID,
        userPoolAppSecret: USER_POOL_APP_CLIENT_SECRET,
    },
});

export const authenticationHandler = ({ event }: { event: CloudFrontRequestEvent }) => {
    return authenticator.handle(event);
};

export const lambdaOriginS3 = async (event: CloudFrontRequestEvent): Promise<CloudFrontRequestResult> => {
    const response = await authenticationHandler({ event });

    // NOTE: Intercept Response & Chain Handler(s)
    //  e.g., Perform Path Rewrite for `/` => `/index.html` Behavior...
    //  e.g., `if (response.isAuthenticated) { ... }`

    return response.actual;
};
