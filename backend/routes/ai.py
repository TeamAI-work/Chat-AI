from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import os
import asyncio
from dotenv import load_dotenv
import ollama

load_dotenv()

router = APIRouter()

from typing import Optional

# Pydantic model to parse incoming JSON body
class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = None
    mode: Optional[str] = None

def _collect_ollama_chunks(model_to_use: str, messages: list) -> list:
    """Run the blocking ollama stream and collect all chunks synchronously."""
    chunks = []
    for chunk in ollama.chat(model=model_to_use, messages=messages, stream=True):
        chunks.append(chunk)
    return chunks

async def stream_ollama_async(request: ChatRequest):
    """Async generator: runs blocking ollama.chat in a thread, then yields processed tokens."""
    model_to_use = request.model or os.getenv("OLLAMA_MODEL") or "llama3"
    mode = request.mode or "default"
    
    if mode == "thinking":
        custome_msg = "You are a highly analytical assistant. Provide deep, step-by-step reasoning for every query. Wrap your internal thoughts in <think> tags."
    elif mode == "research":
        custome_msg = "You are a research expert. Provide comprehensive, well-structured, and verified information. Focus on depth and accuracy."
    elif mode == "web":
        custome_msg = "You are an assistant with real-time web access capabilities. Focus on providing up-to-date and relevant information from the web."
    else:
        custome_msg = "You are a helpful and concise AI assistant."
    messages = [
        {"role": "system", "content": custome_msg},
        {"role": "user", "content": request.message},
    ]
    
    in_think_block = False
    
    # Use a queue to bridge the blocking generator and the async generator
    loop = asyncio.get_event_loop()
    queue: asyncio.Queue = asyncio.Queue()
    
    def _producer():
        try:
            for chunk in ollama.chat(model=model_to_use, messages=messages, stream=True):
                loop.call_soon_threadsafe(queue.put_nowait, chunk)
        except Exception as e:
            loop.call_soon_threadsafe(queue.put_nowait, RuntimeError(str(e)))
        finally:
            loop.call_soon_threadsafe(queue.put_nowait, None)  # sentinel

    # Run the blocking producer in a thread pool
    asyncio.get_event_loop().run_in_executor(None, _producer)
    
    try:
        while True:
            chunk = await queue.get()
            
            # Sentinel — stream finished
            if chunk is None:
                break
            
            # Propagate errors from the producer thread
            if isinstance(chunk, RuntimeError):
                yield f"\n\n[Ollama Error: {chunk}]"
                break
            
            if isinstance(chunk, dict):
                msg = chunk.get("message", {})
                content = msg.get("content", "")
                thinking = msg.get("thinking")
            else:
                msg = getattr(chunk, "message", None)
                content = getattr(msg, "content", "") if msg else ""
                thinking = getattr(msg, "thinking", None) if msg else None

            if thinking:
                if not in_think_block:
                    yield "<think>"
                    in_think_block = True
                yield thinking
            else:
                if in_think_block:
                    yield "</think>"
                    in_think_block = False
                if content:
                    yield content

        if in_think_block:
            yield "</think>"
            
    except Exception as e:
        yield f"\n\n[Stream Error: {str(e)}]"

@router.post("/chat")
async def chat(request: ChatRequest):
    return StreamingResponse(
        stream_ollama_async(request),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )