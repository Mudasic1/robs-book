import httpx
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL = "text-embedding-004"
CHAT_MODEL = "gemini-1.5-flash"

def get_embedding(text: str) -> list[float]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{EMBEDDING_MODEL}:embedContent?key={GEMINI_API_KEY}"
    payload = {
        "model": f"models/{EMBEDDING_MODEL}",
        "content": {"parts": [{"text": text}]},
        "taskType": "RETRIEVAL_DOCUMENT"
    }
    
    with httpx.Client() as client:
        response = client.post(url, json=payload)
        response.raise_for_status()
        return response.json()["embedding"]["values"]

def generate_answer(context: str, question: str) -> str:
    """
    Generate an educational answer using Gemini AI with direct REST API.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{CHAT_MODEL}:generateContent?key={GEMINI_API_KEY}"
    
    system_instruction = """You are an expert AI tutor for Physical AI and Humanoid Robotics.
Your primary work is to explain concepts clearly and summarize content effectively.

Your responsibilities:
- Explain technical concepts in simple, understandable terms
- Provide clear summaries with key points when asked
- Use examples to illustrate complex ideas
- Be encouraging and supportive to learners
- Break down difficult topics into digestible parts
- Use markdown formatting for better readability

When asked to summarize: Provide bullet points of main ideas
When asked to explain: Give detailed but clear explanations with examples
"""

    # Detect query intent
    question_lower = question.lower()
    
    if any(word in question_lower for word in ["summarize", "summary", "tldr", "brief"]):
        prompt = f"Based on this context, provide a clear summary: \n\nContext:\n{context}\n\nQuestion: {question}\n\nProvide a concise summary with key points in bullet format."
    elif any(word in question_lower for word in ["explain", "what is", "how does", "why"]):
        prompt = f"Based on this context, explain the concept clearly:\n\nContext:\n{context}\n\nQuestion: {question}\n\nProvide a detailed but understandable explanation with examples if helpful."
    else:
        prompt = f"Context:\n{context}\n\nQuestion: {question}\n\nProvide a helpful, educational response."

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "systemInstruction": {
            "parts": [
                {"text": system_instruction}
            ]
        },
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 2048,
        }
    }
    
    try:
        with httpx.Client() as client:
            response = client.post(url, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Error generating answer with Gemini REST: {e}")
        return "I apologize, but I'm having trouble generating a response right now. Please try again."

def personalize_content(content: str, software_bg: str = "General", hardware_bg: str = "General") -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{CHAT_MODEL}:generateContent?key={GEMINI_API_KEY}"
    user_background = f"Software: {software_bg}, Hardware: {hardware_bg}"
    prompt = f"Adapt the following educational content for a learner with this background: {user_background}.\nAdjust the complexity and examples to match their level.\n\nContent:\n{content}"
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    try:
        with httpx.Client() as client:
            response = client.post(url, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Error personalizing content: {e}")
        return content

def translate_content(content: str, target_lang: str = 'ur') -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{CHAT_MODEL}:generateContent?key={GEMINI_API_KEY}"
    prompt = f"Translate the following technical content into Urdu (Pakistan).\nEnsure technical terms (like ROS, Node, Topic) are preserved in English or transliterated effectively where standard.\nMaintain Markdown formatting.\n\nContent:\n{content}"
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    try:
        with httpx.Client() as client:
            response = client.post(url, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Translation error: {e}")
        return content
