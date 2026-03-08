import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# AWS Config (still needed for DynamoDB)
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

# AI Config (Gemini replaces Bedrock for LLM generation)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL_ID = os.getenv("GEMINI_MODEL_ID", "gemini-2.5-flash")

# DynamoDB Tables
DYNAMODB_TABLE_SCHEMES = os.getenv("DYNAMODB_TABLE_SCHEMES", "schemes")
DYNAMODB_TABLE_USERS = os.getenv("DYNAMODB_TABLE_USERS", "users")
DYNAMODB_TABLE_CONVERSATIONS = os.getenv("DYNAMODB_TABLE_CONVERSATIONS", "conversations")
DYNAMODB_TABLE_SUBMISSIONS = os.getenv("DYNAMODB_TABLE_SUBMISSIONS", "form_submissions")
DYNAMODB_TABLE_EMBEDDINGS = os.getenv("DYNAMODB_TABLE_EMBEDDINGS", "embeddings")

# S3 & CloudWatch
S3_BUCKET_DOCUMENTS = os.getenv("S3_BUCKET_DOCUMENTS", "schemesense-documents")
CLOUDWATCH_LOG_GROUP = os.getenv("CLOUDWATCH_LOG_GROUP", "/aws/lambda/schemesense-api")

# RAG Configuration
RAW_DATA_PATH = os.getenv("RAW_DATA_PATH", "data/raw_schemes.json")
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 1000))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 200))
