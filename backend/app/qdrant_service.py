import httpx
import os
from dotenv import load_dotenv
from app.gemini_service import get_embedding
import uuid

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "physical_ai_textbook"

def init_collection():
    headers = {"api-key": QDRANT_API_KEY}
    url = f"{QDRANT_URL}/collections/{COLLECTION_NAME}"
    
    with httpx.Client() as client:
        response = client.get(url, headers=headers)
        if response.status_code == 404:
            # Create collection
            create_payload = {
                "vectors": {
                    "size": 768,
                    "distance": "Cosine"
                }
            }
            create_response = client.put(url, json=create_payload, headers=headers)
            create_response.raise_for_status()

def ingest_chapter(chapter_id: str, content: str):
    chunks = [content[i:i+2000] for i in range(0, len(content), 2000)]
    points = []
    
    for idx, chunk in enumerate(chunks):
        vector = get_embedding(chunk)
        point_id = str(uuid.uuid4())
        points.append({
            "id": point_id,
            "vector": vector,
            "payload": {
                "chapter_id": chapter_id,
                "text": chunk,
                "chunk_index": idx
            }
        })
    
    headers = {"api-key": QDRANT_API_KEY}
    url = f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points?wait=true"
    
    with httpx.Client() as client:
        response = client.put(url, json={"points": points}, headers=headers)
        response.raise_for_status()

def search_similar(query: str, chapter_id: str = None, top_k: int = 5) -> list[str]:
    try:
        query_vector = get_embedding(query)
    except Exception as e:
        print(f"Error generating query embedding: {e}")
        return []

    headers = {"api-key": QDRANT_API_KEY}
    url = f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points/search"
    
    query_filter = None
    if chapter_id:
        query_filter = {
            "must": [
                {
                    "key": "chapter_id",
                    "match": {"value": chapter_id}
                }
            ]
        }
    
    payload = {
        "vector": query_vector,
        "filter": query_filter,
        "limit": top_k,
        "with_payload": True,
        "score_threshold": 0.5
    }
    
    try:
        with httpx.Client() as client:
            response = client.post(url, json=payload, headers=headers, timeout=20.0)
            response.raise_for_status()
            results = response.json()["result"]
            return [hit["payload"]["text"] for hit in results]
    except Exception as e:
        print(f"Error searching Qdrant REST: {e}")
        return []
