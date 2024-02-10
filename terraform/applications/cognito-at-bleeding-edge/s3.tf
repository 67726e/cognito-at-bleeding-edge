
// S3
resource "aws_s3_bucket" "cloudfront_origin_bucket" {
  bucket = "gnelson-test-cognito-at-bleeding-edge-origin"
}

resource "aws_s3_bucket_ownership_controls" "cloudfront_origin_bucket" {
  bucket = aws_s3_bucket.cloudfront_origin_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "cloudfront_origin_bucket" {
  bucket = aws_s3_bucket.cloudfront_origin_bucket.id

  block_public_acls = false
  block_public_policy = false
  ignore_public_acls = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "cloudfront_origin_bucket" {
  bucket = aws_s3_bucket.cloudfront_origin_bucket.id
  acl = "public-read"
}

resource "aws_s3_bucket" "cloudfront_lambda_bucket" {
  bucket = "gnelson-test-cognito-at-bleeding-edge-lambda"
}
