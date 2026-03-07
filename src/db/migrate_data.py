import sqlite3
import os
from src.db.dynamo_manager import db_manager
from src.rag.bedrock_processor import get_titan_embedding
from config import DB_PATH
from src.utils.logger import setup_logger
import time

logger = setup_logger("Migration-Tool")

def migrate_to_dynamo():
    """
    Reads chunks from SQLite, re-embeds them using Titan v2, and saves to DynamoDB.
    """
    if not os.path.exists(DB_PATH):
        logger.error(f"SQLite database not found at {DB_PATH}. Nothing to migrate.")
        return

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        logger.info("Fetching chunks from SQLite...")
        cursor.execute("SELECT scheme_url, domain, chunk_text FROM scheme_chunks")
        rows = cursor.fetchall()
        
        logger.info(f"Fond {len(rows)} chunks to migrate.")
        
        for i, (url, domain, text) in enumerate(rows):
            logger.info(f"Migrating chunk {i+1}/{len(rows)} for {url}...")
            
            # 1. Re-embed using Titan v2 (Mandatory as model changed)
            try:
                embedding = get_titan_embedding(text)
                if not embedding:
                    logger.warning(f"Failed to get embedding for chunk {i+1}. Skipping.")
                    continue
                
                # 2. Construct DynamoDB Item
                import uuid
                chunk_id = str(uuid.uuid4())
                
                item = {
                    'chunk_id': chunk_id,
                    'scheme_url': url,
                    'domain': domain,
                    'chunk_text': text,
                    'embedding': embedding, # DynamoDB handles lists/json
                    'migrated_at': int(time.time())
                }
                
                # 3. Save to DynamoDB
                db_manager.put_embedding(item)
                
                # Throttle slightly to respect Bedrock quotas if needed
                time.sleep(0.1) 
                
            except Exception as e:
                logger.error(f"Error migrating chunk {i+1}: {e}")
                
        conn.close()
        logger.info("Migration completed successfully.")
        
    except Exception as e:
        logger.error(f"Migration failed: {e}", exc_info=True)

if __name__ == "__main__":
    confirm = input("This will re-embed all SQLite chunks and upload to DynamoDB. Proceed? (y/n): ")
    if confirm.lower() == 'y':
        migrate_to_dynamo()
    else:
        print("Migration cancelled.")
