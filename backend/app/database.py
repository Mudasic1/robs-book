from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "❌ DATABASE_URL environment variable is not set. "
        "Please check your .env file in the backend directory."
    )

# Configure engine with NullPool for serverless databases like Neon
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,  # Disable connection pooling for serverless
    connect_args={"sslmode": "require", "connect_timeout": 10}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()