from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import Optional
from mangum import Mangum
from src.verification.production_ocr import ocr_processor
from src.utils.logger import setup_logger
import os
import shutil
# Setup production logger
logger = setup_logger("SchemeSense-API")

app = FastAPI(title="SchemeSense API")
handler = Mangum(app)

# Remove mock router for Streamlined AWS deployment
from src.db.dynamo_manager import db_manager
from src.rag.bedrock_processor import generate_chat_response
# Correct relative import for production structure
try:
    from urls import SCHEME_URLS
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from urls import SCHEME_URLS
import json
import time

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://schemesense-dev.example.com",
        "https://schemesense-prod.example.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    logger.info("Starting up SchemeSense API (Production Mode)...")

class ChatRequest(BaseModel):
    query: str
    user_id: Optional[str] = None

    @validator('query')
    def query_must_be_valid(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Query cannot be empty')
        if len(v) > 2000:
            raise ValueError('Query too long')
        return v.strip()

@app.get("/schemes")
async def get_schemes():
    """Fetch live scheme cards from DynamoDB for the frontend."""
    logger.info("Fetching schemes from DynamoDB for frontend.")
    try:
        schemes = db_manager.get_all_schemes()
        # Clean up relevance_score if present from search
        for s in schemes:
            if 'relevance_score' in s:
                del s['relevance_score']
            # Fallback for frontend expectations (it expects an 'id' but dynamo uses 'scheme_id')
            if 'scheme_id' in s and 'id' not in s:
                s['id'] = s['scheme_id']
        return schemes
    except Exception as e:
        logger.error(f"Failed to fetch schemes: {e}")
        return []

@app.get("/schemes/{scheme_id}")
async def get_scheme(scheme_id: str):
    try:
        # Scan is inefficient for single get, but sufficient for minimalist MVP
        # production would use get_item
        schemes = db_manager.get_all_schemes()
        scheme = next((s for s in schemes if s.get("scheme_id") == scheme_id or s.get("id") == scheme_id), None)
        if scheme:
            if 'scheme_id' in scheme and 'id' not in scheme:
                scheme['id'] = scheme['scheme_id']
            return scheme
        raise HTTPException(status_code=404, detail="Scheme not found")
    except Exception as e:
        logger.error(f"Failed to fetch scheme {scheme_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.query:
        logger.warning("Chat request received with empty query.")
        raise HTTPException(status_code=400, detail="Query is required")
    
    logger.info(f"Chat request received: {request.query[:50]}...")
    try:
        # Streamlined RAG: Search DynamoDB for keywords
        relevant_schemes = db_manager.search_schemes(request.query)
        
        # Build Context String
        context_str = ""
        for i, scheme in enumerate(relevant_schemes):
            context_str += f"\nScheme {i+1}: {scheme.get('name', 'Unknown')}\n"
            context_str += f"Description: {scheme.get('description', 'N/A')}\n"
            context_str += f"Benefits: {scheme.get('benefits', 'N/A')}\n"
            context_str += f"Eligibility: {scheme.get('eligibility', 'N/A')}\n"
            
        if not context_str:
            context_str = "No specific government schemes found matching the exact keywords."

        # Augmented Prompt
        prompt = f"""You are a helpful and polite government scheme advisor bot. 
Provide a clear, simple answer based ONLY on the following Context. 
If the context has no relevant schemes, inform the user you don't have that specific data yet but offer to help with general questions.

Context (DynamoDB Matches):
{context_str}

User Query: {request.query}
"""
        
        # Streamlined Generation step using Bedrock (Claude 3 Sonnet)
        response_text = generate_chat_response(prompt)
        
        logger.info("Chat response generated securely via Bedrock.")
        return {"response": response_text}
    except Exception as e:
        logger.error(f"Chat failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI generation failed.")

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"]
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB

@app.post("/verify")
async def verify(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):
    logger.info(f"Production verification request received for file: {file.filename}")
    
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # Save temporary file
    file_path = f"temp_{file.filename}"
    
    try:
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")

        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        
        # 1. Process using Production OCR (S3 -> Textract -> DynamoDB)
        result = ocr_processor.process_and_verify(file_path, user_id)
        
        # 2. Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
        
        return {
            "submission_id": result['submission_id'],
            "extracted_data": result['extracted_data'],
            "message": "Document processed and stored securely in AWS."
        }
    except Exception as e:
        logger.error(f"Verification failed for {file.filename}: {str(e)}", exc_info=True)
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scrape")
async def scrape_schemes():
    """Simulates scraping fresh scheme data based on urls.py."""
    logger.info("Scraping request received.")
    try:
        raw_data = []
        for category, urls in SCHEME_URLS.items():
            for url in urls:
                # 1. Strip query params and fragments
                clean_url = url.split('?')[0].split('#')[0].rstrip('/')
                
                # 2. Extract last part of the path
                path_parts = clean_url.split('/')
                last_part = path_parts[-1] if path_parts[-1] else (path_parts[-2] if len(path_parts) > 1 else "")
                
                # 3. Cleanup name: remove extensions, replace hyphens/underscores
                scheme_name = last_part.lower()
                for ext in ['.php', '.aspx', '.html', '.htm', '.jsp']:
                    scheme_name = scheme_name.replace(ext, '')
                
                scheme_name = scheme_name.replace('-', ' ').replace('_', ' ').strip().title()
                
                # 4. Handle generic or numeric names
                generic_names = ["Schemes", "Programmes", "Index", "Article", "Major Programmes", "Programs", "Welfare", "Pressreleasepage"]
                if not scheme_name or scheme_name.isdigit() or scheme_name in generic_names:
                    # Try to use a better part of the URL or just prefix with category
                    if len(path_parts) > 2:
                        domain_part = path_parts[2].replace('www.', '').split('.')[0].title()
                        scheme_name = f"{domain_part} {category} Scheme"
                    else:
                        scheme_name = f"General {category} Scheme"

                raw_data.append({
                    "url": url,
                    "category": category,
                    "name": scheme_name,
                    "scraped_at": int(time.time())
                })
        
        # Save to a temporary raw file
        os.makedirs("data", exist_ok=True)
        with open("data/scraped_raw.json", "w") as f:
            json.dump(raw_data, f, indent=2)
            
        return {"message": f"Successfully scraped metadata for {len(raw_data)} scheme URLs.", "count": len(raw_data)}
    except Exception as e:
        logger.error(f"Scrape failed: {e}")
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")

@app.post("/process")
async def process_scraped_data():
    """Processes scraped raw data and ingests it into DynamoDB."""
    logger.info("Process data request received.")
    raw_file = "data/scraped_raw.json"
    if not os.path.exists(raw_file):
        raise HTTPException(status_code=404, detail="No raw data found. Run scrape first.")
        
    try:
        with open(raw_file, "r") as f:
            scraped_items = json.load(f)
            
        # Optional: Load expanded data for high-fidelity enrichment
        expanded_data = {}
        expanded_file = "data/schemes_expanded.json"
        if os.path.exists(expanded_file):
            with open(expanded_file, "r", encoding='utf-8') as f:
                for s in json.load(f):
                    expanded_data[s['name']] = s

        # Ingest into DynamoDB
        success_count = 0
        for item in scraped_items:
            # Enrich with expanded data if name matches
            enriched = expanded_data.get(item["name"], {})
            
            scheme_id = enriched.get("scheme_id") or f"scraped-{int(time.time())}-{success_count}"
            db_manager.put_scheme({
                "scheme_id": scheme_id,
                "name": item["name"],
                "category": item["category"],
                "description": enriched.get("description") or f"Detailed information about {item['name']} available at the official source.",
                "benefits": enriched.get("benefits") or "Refer to official website for latest benefits.",
                "eligibility": enriched.get("eligibility") or "Criteria varies; check official guidelines.",
                "official_url": item["url"],
                "documents": enriched.get("documents") or ["Aadhaar Card", "Income Certificate", "Identity Proof"],
                "how_to_apply": enriched.get("how_to_apply") or "Visit official portal and follow the step-by-step instructions.",
                "is_scraped": True
            })
            success_count += 1
            
        return {"message": f"Successfully processed and ingested {success_count} schemes into DynamoDB.", "count": success_count}
    except Exception as e:
        logger.error(f"Processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting local dev server on port 5001...")
    uvicorn.run(app, host="0.0.0.0", port=5001)
