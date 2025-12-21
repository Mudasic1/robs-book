from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    software_background: Optional[str] = None
    hardware_background: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    software_background: Optional[str]
    hardware_background: Optional[str]
    preferred_language: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ChatRequest(BaseModel):
    question: str
    selected_text: Optional[str] = None
    chapter_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str

class PersonalizeRequest(BaseModel):
    chapter_id: str
    current_content: str

class TranslateRequest(BaseModel):
    content: str
    target_language: str = "ur"