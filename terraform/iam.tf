# Lambda Execution Role
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

# Bedrock Policy
resource "aws_iam_policy" "bedrock_policy" {
  name        = "${var.project_name}-bedrock-policy"
  description = "Allows Lambda to invoke Bedrock models"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:bedrock:us-east-1::foundation-model/us.amazon.nova-pro-v1*",
          "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-text-embeddings-v2*"
        ]
      }
    ]
  })
}

# S3 & DynamoDB Policy
resource "aws_iam_policy" "data_policy" {
  name        = "${var.project_name}-data-policy"
  description = "Allows Lambda to access project S3 and DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = [
          aws_s3_bucket.documents.arn,
          "${aws_s3_bucket.documents.arn}/*"
        ]
      },
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect   = "Allow"
        Resource = [
          aws_dynamodb_table.schemes.arn,
          "${aws_dynamodb_table.schemes.arn}/index/*",
          aws_dynamodb_table.users.arn,
          aws_dynamodb_table.conversations.arn,
          "${aws_dynamodb_table.conversations.arn}/index/*",
          aws_dynamodb_table.submissions.arn,
          "${aws_dynamodb_table.submissions.arn}/index/*",
          aws_dynamodb_table.embeddings.arn
        ]
      },
      {
        Action = [
          "textract:AnalyzeDocument",
          "textract:GetDocumentAnalysis",
          "textract:StartDocumentAnalysis"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# CloudWatch Logs Policy
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_bedrock" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.bedrock_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_data" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.data_policy.arn
}
