import pytest
from unittest.mock import Mock, patch
from src.rag.bedrock_processor import VectorStore

class TestVectorDB:
    @patch('src.rag.bedrock_processor.OpenSearch')
    def test_store_embedding(self, mock_opensearch):
        # Mock the OpenSearch client
        mock_client = Mock()
        mock_opensearch.return_value = mock_client
        
        store = VectorStore()
        
        test_text = "This is a test scheme"
        test_embedding = [0.1, 0.2, 0.3]
        test_metadata = {"scheme_url": "http://test.com"}
        
        store.store_embedding(test_text, test_embedding, test_metadata)
        
        # Verify index was called with correctly structured doc containing embedding
        mock_client.index.assert_called_once()
        call_args = mock_client.index.call_args[1]
        assert call_args['index'] == "schemes"
        assert call_args['body']['text'] == test_text
        assert call_args['body']['embedding'] == test_embedding
        assert call_args['body']['scheme_url'] == test_metadata['scheme_url']

    @patch('src.rag.bedrock_processor.OpenSearch')
    def test_search_similar(self, mock_opensearch):
        # Mock OpenSearch client and response
        mock_client = Mock()
        mock_opensearch.return_value = mock_client
        
        mock_response = {
            "hits": {
                "hits": [
                    {"_source": {"text": "Scheme A", "scheme_url": "url1"}},
                    {"_source": {"text": "Scheme B", "scheme_url": "url2"}}
                ]
            }
        }
        mock_client.search.return_value = mock_response
        
        store = VectorStore()
        test_query_embedding = [0.1, 0.2, 0.3]
        
        results = store.search_similar(test_query_embedding, limit=2)
        
        # Verify the search query constructed for KNN
        mock_client.search.assert_called_once()
        call_args = mock_client.search.call_args[1]
        assert call_args['index'] == "schemes"
        assert call_args['body']['size'] == 2
        assert call_args['body']['query']['knn']['embedding']['vector'] == test_query_embedding
        
        # Verify the parsing of hits
        assert len(results) == 2
        assert results[0]['text'] == "Scheme A"
        assert results[1]['text'] == "Scheme B"
