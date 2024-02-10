
import { CloudFrontRequestEvent } from 'aws-lambda';

import {
    USER_POOL_ID,
    USER_POOL_DOMAIN,
    USER_POOL_APP_CLIENT_ID,
    USER_POOL_APP_CLIENT_SECRET,
} from './configuration';

import { DefaultAuthenticator } from '../../../../library/src/DefaultAuthenticator';

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

export const lambdaOriginS3 = async (event: CloudFrontRequestEvent) => {
    const response = await authenticationHandler({ event });

    // NOTE: Intercept Response & Chain Handler(s)
    //  e.g., Perform Path Rewrite for `/` => `/index.html` Behavior...
    //  e.g., ???

    return response;
};