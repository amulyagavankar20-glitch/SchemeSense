import json
import os
import time
import base64
from src.verification.production_ocr import ocr_processor
from src.utils.logger import setup_logger
from src.db.dynamo_manager import db_manager
from src.rag.bedrock_processor import generate_chat_response

# Correct relative import for production structure
try:
    from urls import SCHEME_URLS
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from urls import SCHEME_URLS

# Setup production logger
logger = setup_logger("SchemeSense-API")

def create_response(status_code, body):
    """Utility to create a standardized API Gateway response with CORS."""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        },
        "body": json.dumps(body)
    }

def handler(event, context):
    """Standard AWS Lambda entry point (replaces FastAPI/Mangum)."""
    
    # Extract path and method from API Gateway event
    path = event.get("rawPath", event.get("path", "/"))
    method = event.get("requestContext", {}).get("http", {}).get("method", event.get("httpMethod", "GET"))
    
    logger.info(f"Request received: {method} {path}")

    # Handle OPTIONS (CORS preflight)
    if method == "OPTIONS":
        return create_response(200, {})

    try:
        # --- ROUTING ---
        
        # 1. GET /schemes
        if path == "/schemes" and method == "GET":
            schemes = db_manager.get_all_schemes()
            for s in schemes:
                if 'relevance_score' in s: del s['relevance_score']
                if 'scheme_id' in s and 'id' not in s: s['id'] = s['scheme_id']
            return create_response(200, schemes)

        # 2. GET /schemes/{id}
        elif path.startswith("/schemes/") and method == "GET":
            scheme_id = path.split("/")[-1]
            schemes = db_manager.get_all_schemes()
            scheme = next((s for s in schemes if s.get("scheme_id") == scheme_id or s.get("id") == scheme_id), None)
            if scheme:
                if 'scheme_id' in scheme and 'id' not in scheme: scheme['id'] = scheme['scheme_id']
                return create_response(200, scheme)
            return create_response(404, {"detail": "Scheme not found"})

        # 3. POST /chat
        elif path == "/chat" and method == "POST":
            body_str = event.get("body", "{}")
            if event.get("isBase64Encoded", False):
                try:
                    body_str = base64.b64decode(body_str).decode("utf-8")
                except:
                    pass
            body = json.loads(body_str)
            query = body.get("query", "")
            if not query:
                return create_response(400, {"detail": "Query is required"})
            
            # Simple RAG Retrieval
            relevant_schemes = db_manager.search_schemes(query)
            context_str = ""
            for i, scheme in enumerate(relevant_schemes):
                context_str += f"\nScheme {i+1}: {scheme.get('name', 'Unknown')}\n"
                context_str += f"Description: {scheme.get('description', 'N/A')}\n"
                context_str += f"Benefits: {scheme.get('benefits', 'N/A')}\n"
                context_str += f"Eligibility: {scheme.get('eligibility', 'N/A')}\n"
            
            prompt = f"""You are a helpful government scheme advisor. 
Provide a clear answer based ONLY on the following Context. 
Context:
{context_str if context_str else 'No specific matches found.'}
User Query: {query}
"""
            response_text = generate_chat_response(prompt)
            return create_response(200, {"response": response_text})

        # 4. POST /scrape
        elif path == "/scrape" and method == "POST":
            raw_data = []
            for category, urls in SCHEME_URLS.items():
                for url in urls:
                    clean_url = url.split('?')[0].split('#')[0].rstrip('/')
                    path_parts = clean_url.split('/')
                    last_part = path_parts[-1] if path_parts[-1] else (path_parts[-2] if len(path_parts) > 1 else "")
                    scheme_name = last_part.lower().replace('.php','').replace('.aspx','').replace('.html','').replace('.htm','').replace('.jsp','')
                    scheme_name = scheme_name.replace('-', ' ').replace('_', ' ').strip().title()
                    
                    if not scheme_name or scheme_name.isdigit():
                        generic_names = ["Schemes", "Programmes", "Index", "Article", "Major Programmes", "Programs", "Welfare"]
                        if scheme_name in generic_names or not scheme_name:
                            scheme_name = f"General {category} Scheme"

                    raw_data.append({"url": url, "category": category, "name": scheme_name, "scraped_at": int(time.time())})
            
            os.makedirs("data", exist_ok=True)
            with open("data/scraped_raw.json", "w") as f:
                json.dump(raw_data, f, indent=2)
            return create_response(200, {"message": f"Successfully scraped {len(raw_data)} schemes.", "count": len(raw_data)})

        # 5. POST /process
        elif path == "/process" and method == "POST":
            raw_file = "data/scraped_raw.json"
            if not os.path.exists(raw_file):
                return create_response(404, {"detail": "No raw data found. Run scrape first."})
            
            with open(raw_file, "r") as f:
                scraped_items = json.load(f)
            
            expanded_data = {}
            if os.path.exists("data/schemes_expanded.json"):
                with open("data/schemes_expanded.json", "r", encoding='utf-8') as f:
                    for s in json.load(f): expanded_data[s['name']] = s

            success_count = 0
            for item in scraped_items:
                enriched = expanded_data.get(item["name"], {})
                db_manager.put_scheme({
                    "scheme_id": enriched.get("scheme_id") or f"scraped-{int(time.time())}-{success_count}",
                    "name": item["name"],
                    "category": item["category"],
                    "description": enriched.get("description") or f"Information about {item['name']}.",
                    "official_url": item["url"],
                    "is_scraped": True
                })
                success_count += 1
            return create_response(200, {"message": f"Ingested {success_count} schemes.", "count": success_count})

        # 6. POST /verify
        elif path == "/verify" and method == "POST":
            return create_response(501, {"detail": "Verification is temporarily unavailable in lean mode."})

        return create_response(404, {"detail": f"Path {path} not found"})

    except Exception as e:
        logger.error(f"Handler error: {str(e)}")
        return create_response(500, {"detail": "Internal Server Error"})

if __name__ == "__main__":
    # Local Test Mock
    print("Testing Lambda Handler locally...")
    mock_event = {"rawPath": "/schemes", "requestContext": {"http": {"method": "GET"}}}
    print(json.dumps(handler(mock_event, None), indent=2))

