
// Lambda
resource "aws_iam_role" "lambda_role" {
    name = "cloudfront-lambda"

    assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        },
        {
            "Action": "sts:AssumeRole",
            "Principal": {
                "Service": "edgelambda.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF
}

resource "aws_iam_policy" "lambda_policy_cloudwatch" {
    name = "cloudfront-cognito-cloudwatch"
    path = "/"
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": "logs:CreateLogGroup",
        "Resource": "arn:aws:logs:*:*:*"
    },
    {
        "Effect": "Allow",
        "Action": [
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        "Resource": [
            "arn:aws:logs:*:*:log-group:*:*"
        ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_role_policy_cloudwatch" {
    role = aws_iam_role.lambda_role.id

    policy_arn = aws_iam_policy.lambda_policy_cloudwatch.arn
}

resource "aws_lambda_function" "lambda" {
    function_name = "cloudfront-lambda"
    description = "cloudfront-lambda"

    publish = true
    architectures = ["x86_64"]
    runtime = "nodejs16.x"
    package_type = "Zip"
    handler = "src/functions/lambda-at-edge/handler.lambdaOriginS3"

    s3_bucket = aws_s3_bucket.cloudfront_lambda_bucket.bucket
    s3_key = "lambda_origin_s3-${var.lambda_version}.zip"

    role = aws_iam_role.lambda_role.arn
}
