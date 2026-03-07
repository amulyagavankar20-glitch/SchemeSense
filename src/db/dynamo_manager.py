import boto3
import os
import uuid
import time
from botocore.exceptions import ClientError
from config import (
    AWS_REGION,
    DYNAMODB_TABLE_SCHEMES,
    DYNAMODB_TABLE_USERS,
    DYNAMODB_TABLE_CONVERSATIONS,
    DYNAMODB_TABLE_EMBEDDINGS
)
from src.utils.logger import setup_logger

logger = setup_logger("Dynamo-Manager")

def get_dynamodb_resource():
    return boto3.resource(
        'dynamodb',
        region_name=AWS_REGION
    )

class DynamoManager:
    def __init__(self):
        self.dynamodb = get_dynamodb_resource()
        self.schemes_table = self.dynamodb.Table(DYNAMODB_TABLE_SCHEMES)
        self.users_table = self.dynamodb.Table(DYNAMODB_TABLE_USERS)
        self.conv_table = self.dynamodb.Table(DYNAMODB_TABLE_CONVERSATIONS)
        self.emb_table = self.dynamodb.Table(DYNAMODB_TABLE_EMBEDDINGS)

    # --- Schemes ---
    def put_scheme(self, scheme_data: dict):
        try:
            scheme_data['updated_at'] = int(time.time())
            self.schemes_table.put_item(Item=scheme_data)
            logger.info(f"Saved scheme: {scheme_data.get('scheme_id')}")
        except ClientError as e:
            logger.error(f"Error saving scheme: {e}")
            raise e

    def get_schemes_by_category(self, category: str):
        try:
            response = self.schemes_table.query(
                IndexName='CategoryIndex',
                KeyConditionExpression="category = :cat",
                ExpressionAttributeValues={":cat": category}
            )
            return response.get('Items', [])
        except ClientError as e:
            logger.error(f"Error querying category: {e}")
            return []

    # --- Users ---
    def get_or_create_user(self, user_id: str):
        try:
            response = self.users_table.get_item(Key={'user_id': user_id})
            if 'Item' in response:
                return response['Item']
            
            # Create if not exists
            new_user = {
                'user_id': user_id,
                'created_at': int(time.time()),
                'extracted_documents': []
            }
            self.users_table.put_item(Item=new_user)
            return new_user
        except ClientError as e:
            logger.error(f"Error getting/creating user: {e}")
            return None

    # --- Conversations ---
    def save_chat(self, user_id: str, conversation_id: str, message: str, response: str):
        try:
            timestamp = int(time.time())
            # TTL for 30 days
            ttl = timestamp + (30 * 24 * 60 * 60)
            
            chat_item = {
                'conversation_id': conversation_id,
                'user_id': user_id,
                'message': message,
                'response': response,
                'timestamp': timestamp,
                'ttl': ttl
            }
            self.conv_table.put_item(Item=chat_item)
            logger.info(f"Saved chat for conversation: {conversation_id}")
        except ClientError as e:
            logger.error(f"Error saving chat: {e}")

    # --- Embeddings (For production RAG) ---
    def put_embedding(self, chunk_data: dict):
        try:
            self.emb_table.put_item(Item=chunk_data)
        except ClientError as e:
            logger.error(f"Error saving embedding: {e}")

    def scan_embeddings(self):
        """
        Scan all embeddings for similarity search. 
        Note: For large production datasets, consider Amazon OpenSearch or Vector Search.
        """
        try:
            response = self.emb_table.scan()
            return response.get('Items', [])
        except ClientError as e:
            logger.error(f"Error scanning embeddings: {e}")
            return []

# Singleton instance
db_manager = DynamoManager()
