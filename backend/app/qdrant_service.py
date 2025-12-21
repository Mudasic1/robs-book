from qdrant_client import QdrantClient
from qdrant_client.http import models
import os
from dotenv import load_dotenv
from app.gemini_service import get_embedding
import uuid

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
COLLECTION_NAME = "physical_ai_textbook"

def init_collection():
    try:
        client.get_collection(COLLECTION_NAME)
    except Exception:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=768, distance=models.Distance.COSINE),
        )

def ingest_chapter(chapter_id: str, content: str):
    # Split content into chunks (simple split for now, robust langchain splitting recommended properly)
    chunks = [content[i:i+2000] for i in range(0, len(content), 2000)]
    
    points = []
    for idx, chunk in enumerate(chunks):
        vector = get_embedding(chunk)
        point_id = str(uuid.uuid4())
        points.append(models.PointStruct(
            id=point_id,
            vector=vector,
            payload={
                "chapter_id": chapter_id,
                "text": chunk,
                "chunk_index": idx
            }
        ))
    
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )

def search_similar(query: str, chapter_id: str = None, top_k: int = 5) -> list[str]:
    """
    Search for similar content in Qdrant vector database.
    
    Args:
        query: The search query
        chapter_id: Optional chapter filter
        top_k: Number of results to return
        
    Returns:
        List of relevant text chunks
    """
    try:
        query_vector = get_embedding(query)
    except Exception as e:
        print(f"Error generating query embedding: {e}")
        return []
    
    query_filter = None
    if chapter_id:
        query_filter = models.Filter(
            must=[
                models.FieldCondition(
                    key="chapter_id",
                    match=models.MatchValue(value=chapter_id)
                )
            ]
        )
    
    try:
        # Use query method instead of search for newer Qdrant client
        results = client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            query_filter=query_filter,
            limit=top_k,
            score_threshold=0.5  # Only return results with decent similarity
        )
        
        # Handle both old and new response formats
        if hasattr(results, 'points'):
            return [hit.payload['text'] for hit in results.points]
        else:
            return [hit.payload['text'] for hit in results]
    except Exception as e:
        print(f"Error searching Qdrant: {e}")
        # Fallback: try old search method
        try:
            results = client.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_vector,
                query_filter=query_filter,
                limit=top_k,
                score_threshold=0.5
            )
            return [hit.payload['text'] for hit in results]
        except Exception as e2:
            print(f"Fallback search also failed: {e2}")
            return []
