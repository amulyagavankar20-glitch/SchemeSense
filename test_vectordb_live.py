from src.rag.bedrock_processor import VectorStore, get_titan_embedding
import sys

def run_test():
    try:
        print("Initializing VectorStore...")
        store = VectorStore()
        
        print("Generating a test embedding using Titan via Bedrock...")
        test_text = "This is a test government scheme for testing vector similarity."
        embedding = get_titan_embedding(test_text)
        
        if not embedding:
            print("Failed to generate embedding.")
            sys.exit(1)
            
        print(f"Successfully got embedding of length {len(embedding)}. Uploading to VectorStore...")
        
        metadata = {
            "scheme_url": "http://test-scheme-url.gov.in"
        }
        
        store.store_embedding(test_text, embedding, metadata)
        print("Successfully stored embedding in OpenSearch.")
        
        print("Retrieving similar entries...")
        results = store.search_similar(embedding, limit=2)
        print("Search Results:")
        for res in results:
            text = res.get('text', '')
            url = res.get('scheme_url', '')
            print(f"- {url}: {text[:50]}...")
            
    except Exception as e:
        print(f"Error during test: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    run_test()
