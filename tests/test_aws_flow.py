import boto3
import os
import sys
from dotenv import load_dotenv

# Ensure we can import from src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.rag.bedrock_processor import ask_claude, get_titan_embedding
from src.db.dynamo_manager import db_manager
from src.verification.production_ocr import ocr_processor

load_dotenv()

def test_bedrock_llm():
    print("\n--- Testing Bedrock LLM (Claude 4 Sonnet) ---")
    try:
        response = ask_claude("What is SchemeSense in one sentence?")
        print(f"Success! Response: {response}")
    except Exception as e:
        print(f"FAILED: {e}")

def test_bedrock_embeddings():
    print("\n--- Testing Bedrock Embeddings (Titan v2) ---")
    try:
        emb = get_titan_embedding("SchemeSense rulez")
        if emb and len(emb) == 1024:
            print(f"Success! Generated embedding of length {len(emb)}")
        else:
            print(f"FAILED: Unexpected length {len(emb) if emb else 'None'}")
    except Exception as e:
        print(f"FAILED: {e}")

def test_dynamodb():
    print("\n--- Testing DynamoDB Connectivity ---")
    try:
        items = db_manager.scan_embeddings()
        print(f"Success! Connected to DynamoDB. Scanned {len(items)} items from embeddings table.")
    except Exception as e:
        print(f"FAILED: {e}")

def test_s3():
    print("\n--- Testing S3 Connectivity ---")
    try:
        s3 = boto3.client('s3')
        bucket = os.getenv('S3_BUCKET_DOCUMENTS')
        response = s3.list_objects_v2(Bucket=bucket, MaxKeys=1)
        print(f"Success! Connected to S3 bucket: {bucket}")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    print("Starting SchemeSense AWS Production Integration Tests...")
    test_bedrock_llm()
    test_bedrock_embeddings()
    test_dynamodb()
    test_s3()
