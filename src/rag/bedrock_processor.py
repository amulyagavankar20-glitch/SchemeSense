import boto3
import json
import time
import os
from botocore.exceptions import ClientError
from opensearchpy import OpenSearch
from circuitbreaker import circuit
import random
from functools import wraps
from config import AWS_REGION, BEDROCK_MODEL_ID, TITAN_EMBEDDING_MODEL_ID
from src.utils.logger import setup_logger

logger = setup_logger("Bedrock-Service")

def get_bedrock_client():
    return boto3.client(
        service_name='bedrock-runtime',
        region_name=AWS_REGION
    )

def get_titan_embedding(text: str):
    """
    Generate 1024-dimension embedding using Amazon Titan Text Embeddings v2.
    """
    client = get_bedrock_client()
    
    body = json.dumps({
        "inputText": text,
        "dimensions": 1024,
        "normalize": True
    })
    
    for attempt in range(5): # Exponential backoff for Bedrock throttles
        try:
            response = client.invoke_model(
                body=body,
                modelId=TITAN_EMBEDDING_MODEL_ID,
                accept='application/json',
                contentType='application/json'
            )
            response_body = json.loads(response.get('body').read())
            return response_body.get('embedding')
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'ThrottlingException':
                wait_time = 2 ** attempt
                logger.warning(f"Bedrock Throttling. Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                logger.error(f"Bedrock Embedding error: {e}")
                raise e
    return None

def retry_with_backoff(max_retries=3, base_delay=1, max_delay=60):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise e
                    delay = min(base_delay * (2 ** attempt) + random.uniform(0, 1), max_delay)
                    logger.warning(f"Attempt {attempt + 1} failed, retrying in {delay:.2f}s: {e}")
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

@circuit(failure_threshold=5, recovery_timeout=60)
def ask_claude(prompt: str, max_tokens: int = 1000):
    """
    Send prompt to Anthropic Claude 3 Sonnet via Bedrock.
    """
    client = get_bedrock_client()
    
    # Claude 3 message format
    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ],
        "temperature": 0.5,
        "top_p": 0.9
    })
    
    for attempt in range(5):
        try:
            response = client.invoke_model(
                body=body,
                modelId=BEDROCK_MODEL_ID,
                accept='application/json',
                contentType='application/json'
            )
            response_body = json.loads(response.get('body').read())
            # Extract content from Claude 3 response
            return response_body['content'][0]['text']
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'ThrottlingException':
                wait_time = 2 ** attempt
                logger.warning(f"Bedrock Throttling. Retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                logger.error(f"Bedrock LLM error: {e}")
                raise e
    return None

@retry_with_backoff(max_retries=3)
def ask_claude_with_retry(prompt: str, max_tokens: int = 1000) -> str:
    return ask_claude(prompt, max_tokens)

if __name__ == "__main__":
    # Quick test
    test_text = "What is SchemeSense?"
    print(f"Testing Titan Embedding for: '{test_text}'")
    emb = get_titan_embedding(test_text)
    if emb:
        print(f"Generated embedding of length {len(emb)}")
        
    print("\nTesting Claude 3 Sonnet...")
    ans = ask_claude("Say hello in one word.")
    print(f"Claude says: {ans}")

class VectorStore:
    def __init__(self):
        self.client = OpenSearch(
            hosts=[{'host': os.getenv('OPENSEARCH_ENDPOINT', 'localhost'), 'port': os.getenv('OPENSEARCH_PORT', 443)}],
            http_auth=(os.getenv('OPENSEARCH_USER', 'admin'), os.getenv('OPENSEARCH_PASS', 'admin')),
            use_ssl=True if os.getenv('OPENSEARCH_PORT', 443) == 443 else False,
            verify_certs=True if os.getenv('OPENSEARCH_PORT', 443) == 443 else False
        )
        
    def store_embedding(self, text: str, embedding: list, metadata: dict):
        doc = {
            "text": text,
            "embedding": embedding,
            **metadata
        }
        self.client.index(index="schemes", body=doc)

    def search_similar(self, query_embedding: list, limit: int = 5) -> list:
        query = {
            "size": limit,
            "query": {
                "knn": {
                    "embedding": {
                        "vector": query_embedding,
                        "k": limit
                    }
                }
            }
        }
        response = self.client.search(index="schemes", body=query)
        return [hit["_source"] for hit in response["hits"]["hits"]]
