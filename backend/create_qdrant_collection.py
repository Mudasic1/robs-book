from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

print(f"Connecting to Qdrant at: {QDRANT_URL}")

# Initialize Qdrant client
client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# Collection name
COLLECTION_NAME = "physical_ai_textbook"

try:
    # Check if collection already exists
    client.get_collection(COLLECTION_NAME)
    print(f"✅ Collection '{COLLECTION_NAME}' already exists!")
except:
    # Create collection if it doesn't exist
    print(f"Creating collection '{COLLECTION_NAME}'...")
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=768,  # Gemini text-embedding-004 produces 768-dimensional vectors
            distance=Distance.COSINE
        )
    )
    print(f"✅ Collection '{COLLECTION_NAME}' created successfully!")

# Verify collection
info = client.get_collection(COLLECTION_NAME)
print(f"\nCollection Info:")
print(f"  - Name: {info.name}")
print(f"  - Vector size: {info.config.params.vectors.size}")
print(f"  - Distance: {info.config.params.vectors.distance}")
print(f"  - Points count: {info.points_count}")
