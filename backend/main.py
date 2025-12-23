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

# CORS - Allow both frontend origins and local development
default_origins = [
    "http://localhost:3000",
    "https://robs-book.vercel.app",
    "https://robs-book-full.vercel.app"
]
env_origins = os.getenv("CORS_ORIGINS", "").split(",")
origins = list(set([o for o in env_origins if o] + default_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
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