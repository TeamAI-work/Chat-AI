from fastapi import APIRouter
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import ollama

load_dotenv()

router = APIRouter()

from typing import Optional

# Pydantic model to parse incoming JSON body
class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = None

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        model_to_use = request.model or os.getenv("OLLAMA_MODEL") or "llama3"
        # print(f"🚀 Using Ollama model: {model_to_use}")
        response = ollama.chat(model=model_to_use, messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": request.message},
        ])
        return {"response": response["message"]["content"]}
    except Exception as e:
        return {"response": str(e)}