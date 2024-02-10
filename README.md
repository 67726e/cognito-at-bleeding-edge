
# cognito-at-bleeding-ege

## Install

```bash
npm install cognito-at-bleeding-edge
```

## Quickstart

```typescript
import { DefaultAuthenticator } from 'cognito-at-bleeding-edge';

const authenticator = new DefaultAuthenticator({
    cognitoConfiguration: {
        userPoolId: "us-east-1_abcdef123",
        userPoolDomain: "some-cognito-pool-domain.auth.us-east-1.amazoncognito.com",
        userPoolAppId: "123456789abcdefghijklmnopq",
        userPoolAppSecret: undefined,
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
```

## Why `cognito-at-bleeding-edge`

Well, the default library is `cognito-at-edge`, and it kind-of sucks. As a library, it spits in the face of several decades of good practice. Single-Responsiblitity and Composability of the inner-workings of the library? No, it's a God-class with a ball-of-yarn approach to software.

Our library offers distinct advantages over the `cognito-at-edge` library:

- Composability and Single-Responsiblity as First-Order Philosophies.

Not liking our logging implementation, cookie naming scheme, or want to customize the business logic of the overall application? One can easily override a single in interface and plug it in. No need to fork the entire library to change basic functionality of this library.

- Composable Return Value(s)

We don't just return an opaque `CloudFrontRequestResult`, we return an enriched object on top of the business-logic ridden response object. We enable one to compose our authentication library with any other library capable of handling off-the-shelf Amazon class structures.

For instance, if you wanted to add some default path handling functionality a la the `DocumentRoot` behavior of Apache HTTPD fame:

```typescript
const response = authenticator.handle(request);

if (response.isAuthenticated) {
    // Alter `response.actual` here!

    return response.actual;
} else {
    return response.actual;
}
```

## Why not `cognito-at-bleeding-edge`

We don't currently the following features implemented in `cognito-at-edge`:

- CSRF Token

We feel this is out of scope of the project, feel free to use an off-the-shelf solution or publish one and compose it with our library.

- Logout URL

We will implement this feature shortly, we just had the good fortune of starting our rewrite before this feature was accepted into `cognito-at-edge`.

- Custom URL(s) for Endpoint(s)

We will implement this feature shortly, we just had the good fortune of starting our rewrite before this feature was accepted into `cognito-at-edge`.

## Develop & Deploy

### Quickstart

```bash
(
VERSION="0.0.28"
rm -rf .serverless/*.zip
npx sls package
aws s3 cp \
    "./.serverless/lambda_origin_s3.zip" \
    "s3://gnelson-test-cognito-at-bleeding-edge-lambda/lambda_origin_s3-${VERSION}.zip"
)
```

```bash
(
VERSION="0.0.28"
# `lambda_version = "0.0.0"` => `lambda_version = "$VERSION"`
sed -i "/lambda_version = \".*\"/c lambda_version = \"${VERSION}\"" \
    "./vars/development.tfvars"

terraform apply --var-file=./vars/development.tfvars
)
```

### Initialization

```bash
terraform apply -target "aws_s3_bucket.cloudfront_origin_bucket"
terraform apply -target "aws_s3_bucket_public_access_block.cloudfront_origin_bucket"
terraform apply -target "aws_s3_bucket_acl.cloudfront_origin_bucket"

terraform apply -target "aws_s3_bucket.cloudfront_origin_bucket"
```
