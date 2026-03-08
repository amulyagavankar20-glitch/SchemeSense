import os
import time
from google import genai
from config import GEMINI_MODEL_ID, GEMINI_API_KEY
from src.utils.logger import setup_logger

logger = setup_logger("Gemini-Service")

def get_gemini_client():
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY environment variable is missing!")
    return genai.Client(api_key=GEMINI_API_KEY)

def generate_chat_response(prompt: str, max_tokens: int = 1000):
    """
    Send prompt to Google Gemini as a fallback.
    """
    client = get_gemini_client()
    
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL_ID,
                contents=prompt,
            )
            return response.text
            
        except Exception as e:
            wait_time = 2 ** attempt
            logger.warning(f"Gemini API error. Retrying in {wait_time}s... Error: {e}")
            time.sleep(wait_time)
            if attempt == 2:
                logger.error(f"Gemini LLM final error: {e}")
                raise e
    return None

def generate_chat_response_with_retry(prompt: str, max_tokens: int = 1000) -> str:
    return generate_chat_response(prompt, max_tokens)

if __name__ == "__main__":
    # Quick test
    print("\nTesting Gemini-2.5-Flash...")
    ans = generate_chat_response("Say hello in one word.")
    print(f"Gemini says: {ans}")
