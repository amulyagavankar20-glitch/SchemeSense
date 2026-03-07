import boto3
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

def get_s3_client():
    return boto3.client(
        's3',
        region_name=os.getenv('AWS_REGION', 'us-east-1')
    )

def setup_s3():
    bucket_name = os.getenv('S3_BUCKET_DOCUMENTS', 'schemesense-documents-production')
    s3 = get_s3_client()
    
    try:
        # 1. Create Bucket
        print(f"Creating bucket: {bucket_name}...")
        location = {'LocationConstraint': os.getenv('AWS_REGION', 'us-east-1')}
        if os.getenv('AWS_REGION') == 'us-east-1':
             s3.create_bucket(Bucket=bucket_name)
        else:
            s3.create_bucket(Bucket=bucket_name, CreateBucketConfiguration=location)
            
        # 2. Enable Versioning
        print("Enabling versioning...")
        s3.put_bucket_versioning(
            Bucket=bucket_name,
            VersioningConfiguration={'Status': 'Enabled'}
        )
        
        # 3. Enable Encryption (SSE-S3)
        print("Enabling default encryption (SSE-S3)...")
        s3.put_bucket_encryption(
            Bucket=bucket_name,
            ServerSideEncryptionConfiguration={
                'Rules': [
                    {
                        'ApplyServerSideEncryptionByDefault': {
                            'SSEAlgorithm': 'AES256'
                        }
                    }
                ]
            }
        )
        
        # 4. Block Public Access
        print("Blocking public access...")
        s3.put_public_access_block(
            Bucket=bucket_name,
            PublicAccessBlockConfiguration={
                'BlockPublicAcls': True,
                'IgnorePublicAcls': True,
                'BlockPublicPolicy': True,
                'RestrictPublicBuckets': True
            }
        )
        
        # 5. Set Lifecycle Policy
        print("Setting lifecycle policy...")
        lifecycle_config = {
            'Rules': [
                {
                    'ID': 'CleanupIncompleteMultiPartUploads',
                    'Status': 'Enabled',
                    'Filter': {'Prefix': ''},
                    'AbortIncompleteMultipartUpload': {
                        'DaysAfterInitiation': 7
                    }
                },
                {
                    'ID': 'MoveToGlacierAndDelete',
                    'Status': 'Enabled',
                    'Filter': {'Prefix': ''},
                    'Transitions': [
                        {
                            'Days': 90,
                            'StorageClass': 'GLACIER'
                        }
                    ],
                    'Expiration': {
                        'Days': 365
                    }
                }
            ]
        }
        s3.put_bucket_lifecycle_configuration(
            Bucket=bucket_name,
            LifecycleConfiguration=lifecycle_config
        )
        
        # 6. Set CORS Policy (Phase 3.2)
        print("Setting CORS policy...")
        cors_configuration = {
            'CORSRules': [{
                'AllowedHeaders': ['*'],
                'AllowedMethods': ['GET', 'POST', 'PUT'],
                'AllowedOrigins': ['*'], # Should be restricted in production
                'MaxAgeSeconds': 3000
            }]
        }
        s3.put_bucket_cors(Bucket=bucket_name, CORSConfiguration=cors_configuration)
        
        print("S3 setup complete.")
        
    except ClientError as e:
        print(f"Error setting up S3: {e}")

if __name__ == "__main__":
    setup_s3()
