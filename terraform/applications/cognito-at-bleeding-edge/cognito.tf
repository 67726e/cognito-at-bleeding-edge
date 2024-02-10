
// Cognito
resource "aws_cognito_user_pool" "cloudfront_pool" {
  name = "cloudfront_pool"
}

resource "aws_cognito_user_pool_client" "cloudfront_pool_client" {
  name  = "cloudfront_pool_client"

  user_pool_id = aws_cognito_user_pool.cloudfront_pool.id

  supported_identity_providers = ["COGNITO"]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = ["code"]
  # TODO: Review Me!
  allowed_oauth_scopes = ["profile", "email", "openid"]

  callback_urls = ["https://d20o2ten651kje.cloudfront.net"]
}

resource "aws_cognito_user_pool_domain" "cloudfront_pool_domain" {
  user_pool_id = aws_cognito_user_pool.cloudfront_pool.id

  domain = "cloudfront-pool-domain"
}
