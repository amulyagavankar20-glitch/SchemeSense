import boto3
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

def get_sns_client():
    return boto3.client(
        'sns',
        region_name=os.getenv('AWS_REGION', 'us-east-1')
    )

def setup_textract_notifications():
    sns = get_sns_client()
    topic_name = "SchemeSenseTextractCompletion"
    
    try:
        # 1. Create SNS Topic
        print(f"Creating SNS topic: {topic_name}...")
        response = sns.create_topic(Name=topic_name)
        topic_arn = response['TopicArn']
        print(f"SNS Topic created: {topic_arn}")
        
        # 2. (Manual/Terraform) Subscribe Lambda to SNS
        print("Note: In production, the 'schemesense-verify' Lambda must be subscribed to this Topic.")
        
        # 3. Create IAM Role for Textract (Manual/Terraform recommendation)
        print("Important: You must create an IAM Role that allows Textract to publish to this SNS Topic.")
        print("The role needs trust relationship with 'textract.amazonaws.com'.")
        
        return topic_arn
        
    except ClientError as e:
        print(f"Error setting up Textract notifications: {e}")
        return None

if __name__ == "__main__":
    setup_textract_notifications()
