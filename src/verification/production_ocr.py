import boto3
import os
import uuid
import time
from botocore.exceptions import ClientError
from config import AWS_REGION, S3_BUCKET_DOCUMENTS, DYNAMODB_TABLE_SUBMISSIONS
from src.utils.logger import setup_logger

logger = setup_logger("Production-OCR")

class TextractProcessor:
    def __init__(self):
        self.s3 = boto3.client('s3', region_name=AWS_REGION)
        self.textract = boto3.client('textract', region_name=AWS_REGION)
        self.dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
        self.table = self.dynamodb.Table(DYNAMODB_TABLE_SUBMISSIONS)

    def upload_to_s3(self, file_path, user_id):
        """Upload document to S3 for processing."""
        try:
            file_name = os.path.basename(file_path)
            s3_key = f"uploads/{user_id}/{uuid.uuid4()}_{file_name}"
            
            logger.info(f"Uploading {file_name} to S3 bucket {S3_BUCKET_DOCUMENTS}...")
            self.s3.upload_file(file_path, S3_BUCKET_DOCUMENTS, s3_key)
            return s3_key
        except ClientError as e:
            logger.error(f"S3 Upload failed: {e}")
            raise e

    def start_document_analysis(self, s3_key):
        """Start asynchronous Textract analysis for documents."""
        try:
            logger.info(f"Starting Textract analysis for {s3_key}...")
            response = self.textract.analyze_document(
                Document={'S3Object': {'Bucket': S3_BUCKET_DOCUMENTS, 'Name': s3_key}},
                FeatureTypes=['TABLES', 'FORMS']
            )
            return response
        except ClientError as e:
            logger.error(f"Textract analysis failed: {e}")
            raise e

    def extract_form_data(self, textract_response):
        """Helper to parse Textract result for key-value pairs."""
        # Simple extraction logic for demo - can be expanded with specific schemas
        data = {}
        processed_blocks = textract_response.get('Blocks', [])
        
        # Placeholder for complex key-value parsing
        # In production, we'd use Textract's Query or specialized parsers
        for block in processed_blocks:
            if block['BlockType'] == 'LINE':
                text = block.get('Text', '')
                # Just collect all lines for now as a summary
                data['raw_lines'] = data.get('raw_lines', []) + [text]
                
        return data

    def process_and_verify(self, file_path, user_id):
        """End-to-end production flow."""
        try:
            # 1. Upload
            s3_key = self.upload_to_s3(file_path, user_id)
            
            # 2. Analyze (Synchronous for small docs, use start_document_analysis for large ones)
            # For identity docs (Aadhar/PAN), analyze_document is usually fast enough
            response = self.start_document_analysis(s3_key)
            
            # 3. Extract
            extracted_data = self.extract_form_data(response)
            
            # 4. Save to DynamoDB
            submission_id = str(uuid.uuid4())
            submission_item = {
                'submission_id': submission_id,
                'user_id': user_id,
                's3_key': s3_key,
                'extracted_data': extracted_data,
                'status': 'PROCESSED',
                'timestamp': int(time.time())
            }
            self.table.put_item(Item=submission_item)
            
            logger.info(f"Successfully processed document {submission_id}")
            return submission_item
            
        except Exception as e:
            logger.error(f"Production verification flow failed: {e}")
            raise e

# Singleton instance
ocr_processor = TextractProcessor()
