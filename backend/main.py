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

# Get allowed origins from environment variable or allow all for development
allowed_origins_str = os.getenv("CORS_ORIGINS", "*")
if allowed_origins_str == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

print(f"🔧 CORS enabled for origins: {allowed_origins}")  # Debug log

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True if allowed_origins != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Length", "Content-Range"],
    max_age=3600,
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(personalization_router)

@app.get("/")
async def root():
    return {"message": "Physical AI Textbook API"}

@app.get("/signup")
async def signup_redirect():
    return {
        "message": "This is the API server. The signup page is located on the frontend.",
        "frontend_url": "http://localhost:3000/signup"
    }

@app.get("/login")
async def login_redirect():
    return {
        "message": "This is the API server. The login page is located on the frontend.",
        "frontend_url": "http://localhost:3000/login"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
