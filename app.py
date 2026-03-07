from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import Optional
from mangum import Mangum
from crewai import Crew
from src.chatbot.tasks import create_recommendation_task
from src.chatbot.agents import scholar_agent, support_agent
from src.verification.production_ocr import ocr_processor
from src.utils.logger import setup_logger
from src.auth.middleware import get_current_user
from src.auth.models import TokenData
import os
import shutil
# Setup production logger
logger = setup_logger("SchemeSense-API")

app = FastAPI(title="SchemeSense API")
handler = Mangum(app)

from mock_endpoints import router as mock_router
app.include_router(mock_router)

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
    user_id: str

    @validator('query')
    def query_must_be_valid(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Query cannot be empty')
        if len(v) > 2000:
            raise ValueError('Query too long')
        return v.strip()

@app.post("/scrape")
async def trigger_scrape(current_user: TokenData = Depends(get_current_user)):
    logger.info("Manual scrape triggered via API.")
    try:
        from src.scraper.collector import run_expanded_scrape
        run_expanded_scrape()
        logger.info("Scraping completed successfully.")
        return {"message": "Scraping of 50+ sites completed. Run /process to embed."}
    except Exception as e:
        logger.error(f"Scraping failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Scraping process failed internally.")

@app.post("/process")
async def process_data(current_user: TokenData = Depends(get_current_user)):
    logger.info("Data processing/embedding triggered via API.")
    try:
        from src.rag.processor import process_and_store_chunks
        process_and_store_chunks()
        logger.info("Data processing completed successfully.")
        return {"message": "Data chunked and embedded into SQLite successfully."}
    except Exception as e:
        logger.error(f"Processing failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Embedding process failed internally.")

@app.post("/chat")
async def chat(request: ChatRequest, current_user: TokenData = Depends(get_current_user)):
    if not request.query:
        logger.warning("Chat request received with empty query.")
        raise HTTPException(status_code=400, detail="Query is required")
    
    logger.info(f"Chat request received: {request.query[:50]}...")
    try:
        # Run CrewAI (Scholar Agent now handles its own retrieval via tool)
        tasks = create_recommendation_task(request.query)
        crew = Crew(
            agents=[scholar_agent, support_agent],
            tasks=tasks,
            verbose=False # Keep CrewAI quiet in logs
        )
        
        result = crew.kickoff()
        logger.info("Chat response generated successfully.")
        return {"response": str(result.raw)}
    except Exception as e:
        logger.error(f"Chat failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="AI generation failed.")

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"]
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB

@app.post("/verify")
async def verify(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    current_user: TokenData = Depends(get_current_user)
):
    logger.info(f"Production verification request received for file: {file.filename}")
    
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type")
        
    if user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

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

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting local dev server on port 5000...")
    uvicorn.run(app, host="0.0.0.0", port=5000)
