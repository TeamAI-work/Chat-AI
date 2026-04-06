from fastapi import APIRouter
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import ollama

load_dotenv()

router = APIRouter()

# Pydantic model to parse incoming JSON body
class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = ollama.chat(model=os.getenv("OLLAMA_MODEL"), messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": request.message},
        ])
        return {"response": response["message"]["content"]}
    except Exception as e:
        return {"response": str(e)}