import json
import os
import numpy as np
import time
import uuid
from src.rag.bedrock_processor import get_titan_embedding, VectorStore
from src.db.dynamo_manager import db_manager
from langchain_text_splitters import RecursiveCharacterTextSplitter
from config import RAW_DATA_PATH, CHUNK_SIZE, CHUNK_OVERLAP
from src.utils.logger import setup_logger

logger = setup_logger("RAG-Processor")

def store_in_opensearch(url, domain, chunk_text, embedding):
    try:
        store = VectorStore()
        metadata = {
            'chunk_id': str(uuid.uuid4()),
            'scheme_url': url,
            'domain': domain,
            'processed_at': int(time.time())
        }
        store.store_embedding(chunk_text, embedding, metadata)
    except Exception as e:
        logger.error(f"OpenSearch store failed: {e}")

def process_and_store_chunks():
    # 1. Load raw data
    if not os.path.exists(RAW_DATA_PATH):
        logger.error(f"Raw data file not found at {RAW_DATA_PATH}")
        return
    
    try:
        with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
            schemes = json.load(f)
    except Exception as e:
        logger.error(f"Failed to load raw schemes JSON: {str(e)}")
        return
    
    # 2. Setup text splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", " ", ""]
    )
    
    logger.info("Using OpenSearch as primary vector storage backend.")
    logger.info(f"Processing {len(schemes)} schemes into chunks...")
    
    chunk_count = 0
    for scheme in schemes:
        url = scheme['url']
        domain = scheme['domain']
        content = scheme['content']
        
        chunks = text_splitter.split_text(content)
        
        for i, chunk_text in enumerate(chunks):
            chunk_count += 1
            logger.info(f"Embedding chunk {i+1}/{len(chunks)} for {url}...")
            
            # Use Titan v2 via Bedrock
            try:
                embedding = get_titan_embedding(chunk_text)
                if not embedding:
                    continue
                
                store_in_opensearch(url, domain, chunk_text, embedding)
                
                # Small sleep to be nice to Bedrock API
                time.sleep(0.2)
                
            except Exception as e:
                logger.error(f"Error processing chunk {i+1} for {url}: {str(e)}")
                
    logger.info(f"Chunking and embedding complete. Total chunks processed: {chunk_count}")

if __name__ == "__main__":
    process_and_store_chunks()
