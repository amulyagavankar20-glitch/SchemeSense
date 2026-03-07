# SchemeSense - AWS Production Deployment Guide

This guide details how to deploy the SchemeSense application to AWS using the automated scripts and Terraform configuration provided.

## 🚀 Deployment Steps

### 1. Build the Lambda Package

Ensure you have Python 3.11 installed and your virtual environment activated.
Run the build script to package the FastAPI app and its dependencies.

```powershell
.\build_lambda.ps1
```

This will create `terraform\lambda_function_payload.zip`.

### 2. AWS Infrastructure Setup (Terraform)

Navigate to the terraform directory and initialize:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

*Note: This will provision DynamoDB tables, S3 buckets, IAM roles, the Lambda function, and API Gateway.*

### 3. Data Migration (Optional/Recommended)

If you have existing scraped data that needs to be synced to the production DynamoDB and re-embedded using **Titan v2**:

```bash
python -m src.db.migrate_data
```

### 4. Continuous Scraping

The `/scrape` endpoint is now production-ready with concurrent processing. You can trigger it via API Gateway or set up a CloudWatch Event (EventBridge) to trigger the Lambda regularly.

## 🛠 Production Features

- **Logging**: Standardized JSON logging for CloudWatch.
- **Security**: IAM Least Privilege, SSE-S3/DynamoDB encryption, and blocked public S3 access.
- **RAG**: Powered by Amazon Bedrock (Claude 4 + Titan v2).
- **Storage**: Intelligent lifecycle policies moving old documents to Glacier.

## 🚨 Final Checklist

- [ ] Verify Bedrock Model access in AWS Console (`us-east-1` recommended).
- [ ] Create an S3 Bucket for Terraform state (optional but recommended for teams).
- [ ] Update `aws_region` in `variables.tf` if not using `us-east-1`.
