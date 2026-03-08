variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "schemesense"
}

variable "environment" {
  description = "Environment (dev/prod)"
  type        = string
  default     = "production"
}

variable "bedrock_model_id" {
  type    = string
  default = "us.amazon.nova-pro-v1:0"
}

variable "titan_embedding_model_id" {
  type    = string
  default = "amazon.titan-text-embeddings-v2:0"
}

variable "admin_email" {
  description = "Email for cost and system alerts"
  type        = string
  default     = "admin@example.com"
}
