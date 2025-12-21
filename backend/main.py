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

# CORS - Updated for cookie-based authentication
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Required for cookies
    allow_methods=["*"],
    allow_headers=["*"],
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