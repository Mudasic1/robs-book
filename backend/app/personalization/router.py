from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import PersonalizeRequest, TranslateRequest
from app.auth.router import get_current_user
from app.gemini_service import personalize_content, translate_content

router = APIRouter(prefix="/personalize", tags=["personalization"])

@router.post("/content")
def personalize_chapter_content(request: PersonalizeRequest, current_user: User = Depends(get_current_user)):
    # In a real app we might verify if the user has premium access etc.
    # We use the user's background
    personalized_text = personalize_content(
        request.current_content, 
        current_user.software_background or "General", 
        current_user.hardware_background or "General"
    )
    return {"personalized_content": personalized_text}

@router.post("/translate")
def translate_chapter_content(request: TranslateRequest):
    """
    Translate content to target language using Gemini.
    """
    try:
        translated_text = translate_content(request.content, request.target_language)
        return {"translated_content": translated_text}
    except Exception as e:
        print(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")