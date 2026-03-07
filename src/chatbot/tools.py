from crewai.tools import tool
from src.rag.bedrock_processor import get_titan_embedding, VectorStore
from src.db.dynamo_manager import db_manager

@tool
def scheme_retrieval_tool(query: str):
    """
    Search for official government scheme information based on a user query.
    Uses Amazon Bedrock Titan Embeddings and DynamoDB for production retrieval.
    """
    try:
        # 1. Get embedding for the query using Titan v2
        query_emb = get_titan_embedding(query)
        if not query_emb:
            return "Error: Could not generate embedding for the query."
        
        # 2. Get chunks using OpenSearch Vector Database instead of DynamoDB
        store = VectorStore()
        results = store.search_similar(query_embedding=query_emb, limit=5)
        
        if not results:
            return "No relevant scheme information found in the Vector DB. Please ensure data is indexed."
        
        # 3. Format results
        formatted_results = []
        for res in results:
            text = res.get('text', '')
            url = res.get('scheme_url', '')
            formatted_results.append(f"Source: {url}\nContent: {text}\n---")
            
        return "\n".join(formatted_results)
    except Exception as e:
        return f"Error during retrieval: {str(e)}"
