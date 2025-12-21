import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Models - using latest available models
EMBEDDING_MODEL = "models/text-embedding-004"
CHAT_MODEL = "gemini-2.5-flash"

def get_embedding(text: str) -> list[float]:
    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        print(f"Error generating embedding: {e}")
        # For now re-raise to see it in logs, but print first.
        raise e

def generate_answer(context: str, question: str) -> str:
    """
    Generate an educational answer using Gemini AI with system prompt.
    Your work is to explain or summarize the context clearly.
    """
    # System instruction for educational AI tutor
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

    model = genai.GenerativeModel(
        model_name=CHAT_MODEL,
        system_instruction=system_instruction
    )
    
    # Detect query intent
    question_lower = question.lower()
    
    if any(word in question_lower for word in ["summarize", "summary", "tldr", "brief"]):
        prompt = f"""Based on this context, provide a clear summary:

Context:
{context}

Question: {question}

Provide a concise summary with key points in bullet format."""
    
    elif any(word in question_lower for word in ["explain", "what is", "how does", "why"]):
        prompt = f"""Based on this context, explain the concept clearly:

Context:
{context}

Question: {question}

Provide a detailed but understandable explanation with examples if helpful."""
    
    elif any(word in question_lower for word in ["quiz", "test", "question"]):
        prompt = f"""Based on this context, create quiz questions:

Context:
{context}

Question: {question}

Create 3-5 quiz questions with answers to test understanding."""
    
    elif any(word in question_lower for word in ["example", "demonstrate", "show me"]):
        prompt = f"""Based on this context, provide practical examples:

Context:
{context}

Question: {question}

Provide concrete examples to illustrate the concept."""
    
    else:
        prompt = f"""Context:
{context}

Question: {question}

Provide a helpful, educational response."""
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating answer with Gemini: {e}")
        return "I apologize, but I'm having trouble generating a response right now. Please try again."

def personalize_content(content: str, user_background: str) -> str:
    model = genai.GenerativeModel(CHAT_MODEL)
    prompt = f"""
    Adapt the following educational content for a learner with this background: {user_background}.
    Adjust the complexity and examples to match their level.
    
    Content:
    {content}
    """
    response = model.generate_content(prompt)
    return response.text

def translate_content(content: str, target_lang: str = 'ur') -> str:
    """Translate content to target language using Gemini"""
    model = genai.GenerativeModel(CHAT_MODEL)
    prompt = f"""
    Translate the following technical content into Urdu (Pakistan).
    Ensure technical terms (like ROS, Node, Topic) are preserved in English or transliterated effectively where standard.
    Maintain Markdown formatting.
    
    Content:
    {content}
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Translation error: {e}")
        return content  # Return original content if translation fails
