import boto3
import os
from dotenv import load_dotenv

load_dotenv()

# For local testing, use endpoint_url
def get_dynamodb_client():
    return boto3.client(
        'dynamodb',
        region_name=os.getenv('AWS_REGION', 'us-east-1'),
        endpoint_url='http://localhost:8000' # Assuming DynamoDB Local is running
    )

def create_tables():
    client = get_dynamodb_client()
    
    tables = [
        {
            'TableName': os.getenv('DYNAMODB_TABLE_SCHEMES', 'schemes'),
            'KeySchema': [{'AttributeName': 'scheme_id', 'KeyType': 'HASH'}],
            'AttributeDefinitions': [
                {'AttributeName': 'scheme_id', 'AttributeType': 'S'},
                {'AttributeName': 'category', 'AttributeType': 'S'}
            ],
            'GlobalSecondaryIndexes': [{
                'IndexName': 'CategoryIndex',
                'KeySchema': [{'AttributeName': 'category', 'KeyType': 'HASH'}],
                'Projection': {'ProjectionType': 'ALL'},
                'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
            }],
            'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        },
        {
            'TableName': os.getenv('DYNAMODB_TABLE_USERS', 'users'),
            'KeySchema': [{'AttributeName': 'user_id', 'KeyType': 'HASH'}],
            'AttributeDefinitions': [{'AttributeName': 'user_id', 'AttributeType': 'S'}],
            'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        },
        {
            'TableName': os.getenv('DYNAMODB_TABLE_CONVERSATIONS', 'conversations'),
            'KeySchema': [
                {'AttributeName': 'conversation_id', 'KeyType': 'HASH'},
                {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}
            ],
            'AttributeDefinitions': [
                {'AttributeName': 'conversation_id', 'AttributeType': 'S'},
                {'AttributeName': 'timestamp', 'AttributeType': 'N'}
            ],
            'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        },
        {
            'TableName': os.getenv('DYNAMODB_TABLE_SUBMISSIONS', 'form_submissions'),
            'KeySchema': [{'AttributeName': 'submission_id', 'KeyType': 'HASH'}],
            'AttributeDefinitions': [{'AttributeName': 'submission_id', 'AttributeType': 'S'}],
            'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        },
        {
            'TableName': os.getenv('DYNAMODB_TABLE_EMBEDDINGS', 'embeddings'),
            'KeySchema': [{'AttributeName': 'chunk_id', 'KeyType': 'HASH'}],
            'AttributeDefinitions': [{'AttributeName': 'chunk_id', 'AttributeType': 'S'}],
            'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        }
    ]

    for table in tables:
        try:
            # Add SSE (Encryption at rest) if not already specified
            if 'SSESpecification' not in table:
                table['SSESpecification'] = {'Enabled': True}
                
            client.create_table(**table)
            print(f"Created table {table['TableName']}")
            
            # Enable TTL for Conversations table
            if table['TableName'] == os.getenv('DYNAMODB_TABLE_CONVERSATIONS', 'conversations'):
                print(f"Enabling TTL for {table['TableName']} on attribute 'ttl'...")
                client.update_time_to_live(
                    TableName=table['TableName'],
                    TimeToLiveSpecification={
                        'Enabled': True,
                        'AttributeName': 'ttl'
                    }
                )
        except client.exceptions.ResourceInUseException:
            print(f"Table {table['TableName']} already exists")
        except Exception as e:
            print(f"Error creating/configuring table {table['TableName']}: {e}")

if __name__ == "__main__":
    create_tables()
