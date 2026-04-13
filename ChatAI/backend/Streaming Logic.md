# Streaming Logic

Status: [[AI Routes]] | Downstream: [[Ollama Integration]]

## ⚙️ The Async Gap
Ollama's Python library provides a synchronous blocking generator for streaming chats. FastAPI's `StreamingResponse` requires an asynchronous generator. 

### 🏗️ Solution: Producer-Consumer Pattern
To bridge this gap without blocking the server, we use an `asyncio.Queue`:

1. **The Producer (`_producer`):** 
   - Runs in a separate thread pool via `run_in_executor`.
   - Iterates over the blocking Ollama stream.
   - Puts chunks into the queue using `loop.call_soon_threadsafe`.
2. **The Consumer (`stream_ollama_async`):**
   - An async generator that waits on the queue.
   - Yields processed tokens to the network response.

### 🧠 Parsing Logic
- Detects the `thinking` field in the Ollama response.
- Automatically wraps thinking content in `<think>` tags for frontend separation.
- Handles error propagation from the producer thread back to the client.
