from flask import Flask, request, jsonify
import json
import os
import time
import sys

# Add current directory to path so we can import our src and urls
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.db.dynamo_manager import db_manager
from src.rag.bedrock_processor import generate_chat_response
from urls import SCHEME_URLS

app = Flask(__name__)

# Handle CORS preflight OPTIONS requests across all routes
@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        from flask import Response
        res = Response()
        res.headers['Access-Control-Allow-Origin'] = '*'
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        res.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return res, 200

# Basic CORS handler for all responses
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    try:
        schemes = db_manager.get_all_schemes()
        for s in schemes:
            if 'relevance_score' in s: del s['relevance_score']
            if 'scheme_id' in s and 'id' not in s: s['id'] = s['scheme_id']
        return jsonify(schemes)
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/api/schemes/<scheme_id>', methods=['GET'])
def get_scheme(scheme_id):
    try:
        schemes = db_manager.get_all_schemes()
        scheme = next((s for s in schemes if s.get("scheme_id") == scheme_id or s.get("id") == scheme_id), None)
        if scheme:
            if 'scheme_id' in scheme and 'id' not in scheme: scheme['id'] = scheme['scheme_id']
            return jsonify(scheme)
        return jsonify({"detail": "Scheme not found"}), 404
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        body = request.get_json()
        query = body.get("query", "")
        if not query:
            return jsonify({"detail": "Query is required"}), 400
        
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
        return jsonify({"response": response_text})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/api/scrape', methods=['POST'])
def scrape():
    try:
        raw_data = []
        for category, urls in SCHEME_URLS.items():
            for url in urls:
                clean_url = url.split('?')[0].split('#')[0].rstrip('/')
                path_parts = clean_url.split('/')
                last_part = path_parts[-1] if path_parts[-1] else (path_parts[-2] if len(path_parts) > 1 else "")
                scheme_name = last_part.lower().replace('.php','').replace('.aspx','').replace('.html','').replace('.htm','').replace('.jsp','')
                scheme_name = scheme_name.replace('-', ' ').replace('_', ' ').strip().title()
                if not scheme_name or scheme_name.isdigit():
                    scheme_name = f"General {category} Scheme"
                raw_data.append({"url": url, "category": category, "name": scheme_name, "scraped_at": int(time.time())})
        
        data_dir = os.path.join(os.path.dirname(__file__), "data")
        os.makedirs(data_dir, exist_ok=True)
        with open(os.path.join(data_dir, "scraped_raw.json"), "w") as f:
            json.dump(raw_data, f, indent=2)
            
        return jsonify({"message": f"Successfully scraped {len(raw_data)} schemes.", "count": len(raw_data)})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

@app.route('/api/process', methods=['POST'])
def process():
    try:
        raw_file = os.path.join(os.path.dirname(__file__), "data", "scraped_raw.json")
        if not os.path.exists(raw_file):
            return jsonify({"detail": "No raw data found. Run scrape first."}), 404
        
        with open(raw_file, "r") as f:
            scraped_items = json.load(f)
        
        expanded_data = {}
        expanded_file = os.path.join(os.path.dirname(__file__), "data", "schemes_expanded.json")
        if os.path.exists(expanded_file):
            with open(expanded_file, "r", encoding='utf-8') as f:
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
        return jsonify({"message": f"Ingested {success_count} schemes.", "count": success_count})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001)
