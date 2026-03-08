import os
import time
import json
import urllib.request
import urllib.error
from config import GEMINI_MODEL_ID, GEMINI_API_KEY
from src.utils.logger import setup_logger

logger = setup_logger("Gemini-Service")

def generate_chat_response(prompt: str, max_tokens: int = 1000):
    """
    Send prompt to Google Gemini via REST API using standard libraries.
    """
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY environment variable is missing!")
        return "Error: Gemini API Key not configured."

    # Gemini REST API endpoint
    # Note: Using v1beta for better compatibility with current models
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL_ID}:generateContent?key={GEMINI_API_KEY}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "maxOutputTokens": max_tokens,
            "temperature": 0.7
        }
    }
    
    json_data = json.dumps(data).encode("utf-8")
    
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, data=json_data, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode("utf-8"))
                
                # Parse response from Gemini structure
                # candidates[0].content.parts[0].text
                if "candidates" in result and len(result["candidates"]) > 0:
                    content = result["candidates"][0].get("content", {})
                    parts = content.get("parts", [])
                    if len(parts) > 0:
                        return parts[0].get("text", "")
                
                logger.error(f"Unexpected Gemini response structure: {result}")
                return "Error: Unexpected response from AI."
                
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8")
            logger.warning(f"Gemini HTTP Error (Attempt {attempt+1}): {e.code} - {error_body}")
        except Exception as e:
            logger.warning(f"Gemini Request failed (Attempt {attempt+1}): {str(e)}")
            
        wait_time = 2 ** attempt
        time.sleep(wait_time)
        
    return "Error: Failed to connect to AI service after multiple attempts."

def generate_chat_response_with_retry(prompt: str, max_tokens: int = 1000) -> str:
    return generate_chat_response(prompt, max_tokens)

if __name__ == "__main__":
    # Quick local test
    print("\nTesting Gemini Zero-Dependency Implementation...")
    ans = generate_chat_response("Say 'Online' in one word.")
    print(f"Gemini says: {ans}")
