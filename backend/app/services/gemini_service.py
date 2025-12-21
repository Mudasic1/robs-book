import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.pro_model = genai.GenerativeModel('gemini-1.5-pro')
    
    async def generate_answer(self, context: str, question: str) -> str:
        prompt = f"""Based on the following context from the Physical AI & Humanoid Robotics textbook, answer the question clearly and concisely.

Context:
{context}

Question: {question}

Answer based only on the context. If the answer isn't in the context, say so."""
        
        response = self.model.generate_content(prompt)
        return response.text
    
    async def personalize_content(self, content: str, software_bg: str, hardware_bg: str) -> str:
        prompt = f"""Personalize this technical content for a reader with:
Software Background: {software_bg}
Hardware Background: {hardware_bg}

Original Content:
{content}

Adjust technical depth, add relevant examples, and make it engaging while keeping key information."""
        
        response = self.pro_model.generate_content(prompt)
        return response.text
    
    async def translate_to_urdu(self, content: str) -> str:
        prompt = f"""Translate the following technical content to Urdu. Maintain technical terms in English where appropriate.

Content:
{content}

Urdu Translation:"""
        
        response = self.pro_model.generate_content(prompt)
        return response.text

gemini_service = GeminiService()