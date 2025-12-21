from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ChatHistory, User
from app.schemas import ChatRequest, ChatResponse
from app.auth.router import get_current_user
from app.gemini_service import generate_answer
from app.qdrant_service import search_similar
from typing import Optional

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/ask", response_model=ChatResponse)
def ask_question(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Ask a question to the AI tutor with RAG support.
    Supports selected text context and chapter-specific retrieval.
    """
    context = ""
    
    # If text is selected, prioritize it as primary context
    if request.selected_text:
        context += f"Selected Text:\n{request.selected_text}\n\n"
    
    # Retrieve relevant chunks from Qdrant vector database
    try:
        retrieved_chunks = search_similar(
            request.question, 
            request.chapter_id,
            top_k=5  # Increased for better context
        )
        if retrieved_chunks:
            context += "Relevant Context from Textbook:\n" + "\n\n".join(retrieved_chunks)
    except Exception as e:
        print(f"Error retrieving context from Qdrant: {e}")
        # Continue without vector context if Qdrant fails
    
    # Generate answer using Gemini with context
    try:
        answer = generate_answer(context, request.question)
    except Exception as e:
        print(f"Error generating answer: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate answer")
    
    # Save conversation history
    history = ChatHistory(
        user_id=current_user.id,
        chapter_id=request.chapter_id or "general",
        selected_text=request.selected_text,
        question=request.question,
        answer=answer
    )
    db.add(history)
    db.commit()
    
    return {"answer": answer, "context_used": context}

@router.get("/history")
def get_chat_history(
    chapter_id: Optional[str] = None,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chat history for the current user, optionally filtered by chapter"""
    query = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id)
    
    if chapter_id:
        query = query.filter(ChatHistory.chapter_id == chapter_id)
    
    history = query.order_by(ChatHistory.created_at.desc()).limit(limit).all()
    
    return {
        "history": [
            {
                "id": h.id,
                "question": h.question,
                "answer": h.answer,
                "chapter_id": h.chapter_id,
                "selected_text": h.selected_text,
                "created_at": h.created_at
            }
            for h in history
        ]
    }
