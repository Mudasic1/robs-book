from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.auth.router import router as auth_router
from app.chat.router import router as chat_router
from app.personalization.router import router as personalization_router
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Physical AI Textbook API")

# Get allowed origins from environment variable
allowed_origins_str = os.getenv(
    "CORS_ORIGINS", 
    "http://localhost:3000,https://robs-book-full.vercel.app"
)
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

print(f"🔧 CORS enabled for origins: {allowed_origins}")  # Debug log

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Use environment variable
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    expose_headers=["Content-Length", "Content-Range"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(personalization_router)

@app.get("/")
async def root():
    return {"message": "Physical AI Textbook API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
