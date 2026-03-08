# Schemes Table
resource "aws_dynamodb_table" "schemes" {
  name           = "${var.project_name}-schemes"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "scheme_id"
  
  attribute {
    name = "scheme_id"
    type = "S"
  }
  
  attribute {
    name = "category"
    type = "S"
  }
  
  global_secondary_index {
    name               = "CategoryIndex"
    hash_key           = "category"
    projection_type    = "ALL"
  }
  
  server_side_encryption {
    enabled = true
  }
  
  tags = local.common_tags
}

# Users Table
resource "aws_dynamodb_table" "users" {
  name           = "${var.project_name}-users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "user_id"
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  server_side_encryption {
    enabled = true
  }
  
  tags = local.common_tags
}

# Conversations Table
resource "aws_dynamodb_table" "conversations" {
  name           = "${var.project_name}-conversations"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "conversation_id"
  range_key      = "timestamp"
  
  attribute {
    name = "conversation_id"
    type = "S"
  }
  
  attribute {
    name = "timestamp"
    type = "N"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  global_secondary_index {
    name               = "UserIndex"
    hash_key           = "user_id"
    range_key          = "timestamp"
    projection_type    = "ALL"
  }
  
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
  
  server_side_encryption {
    enabled = true
  }
  
  tags = local.common_tags
}

# Form Submissions Table
resource "aws_dynamodb_table" "submissions" {
  name           = "${var.project_name}-submissions"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "submission_id"
  
  attribute {
    name = "submission_id"
    type = "S"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  global_secondary_index {
    name               = "UserIndex"
    hash_key           = "user_id"
    projection_type    = "ALL"
  }
  
  server_side_encryption {
    enabled = true
  }
  
  tags = local.common_tags
}

# Embeddings Table (RAG)
resource "aws_dynamodb_table" "embeddings" {
  name           = "${var.project_name}-embeddings"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "chunk_id"
  
  attribute {
    name = "chunk_id"
    type = "S"
  }
  
  server_side_encryption {
    enabled = true
  }
  
  tags = local.common_tags
}
