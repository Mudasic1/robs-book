from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import google.generativeai as genai
import os
from typing import List, Dict

class QdrantService:
    def __init__(self):
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.collection_name = "physical_ai_textbook"
        self._initialize_collection()
    
    def _initialize_collection(self):
        try:
            self.client.get_collection(self.collection_name)
        except:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=768, distance=Distance.COSINE)
            )
    
    def embed_text(self, text: str) -> List[float]:
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    
    def chunk_text(self, text: str, chunk_size: int = 500) -> List[str]:
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
        return chunks
    
    async def ingest_chapter(self, chapter_id: str, content: str):
        chunks = self.chunk_text(content)
        points = []
        
        for idx, chunk in enumerate(chunks):
            embedding = self.embed_text(chunk)
            points.append(
                PointStruct(
                    id=f"{chapter_id}_{idx}",
                    vector=embedding,
                    payload={
                        "chapter_id": chapter_id,
                        "text": chunk,
                        "chunk_index": idx
                    }
                )
            )
        
        self.client.upsert(collection_name=self.collection_name, points=points)
    
    async def search(self, query: str, chapter_id: str = None, limit: int = 3) -> List[Dict]:
        query_embedding = self.embed_text(query)
        
        search_filter = None
        if chapter_id:
            search_filter = {"must": [{"key": "chapter_id", "match": {"value": chapter_id}}]}
        
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=limit,
            query_filter=search_filter
        )
        
        return [{"text": hit.payload["text"], "score": hit.score} for hit in results]

qdrant_service = QdrantService()