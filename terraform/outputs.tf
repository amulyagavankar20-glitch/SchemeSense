output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "s3_bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.documents.id
}

output "lambda_function_name" {
  value = aws_lambda_function.api.function_name
}

output "frontend_url" {
  description = "The URL of the frontend website"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "dynamodb_table_schemes" {
  value = aws_dynamodb_table.schemes.name
}
