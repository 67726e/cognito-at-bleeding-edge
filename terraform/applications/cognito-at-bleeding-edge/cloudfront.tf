
// CloudFront
resource "aws_cloudfront_distribution" "cloudfront" {
  enabled             = true
  # is_ipv6_enabled     = true
  # comment             = "Some comment"
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.cloudfront_origin_bucket.bucket_regional_domain_name
    origin_id = "cloudfront_origin_bucket"
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "cloudfront_origin_bucket"

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    lambda_function_association {
      event_type = "viewer-request"
      lambda_arn = aws_lambda_function.lambda.qualified_arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
