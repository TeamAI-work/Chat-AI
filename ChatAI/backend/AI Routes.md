# AI Routes

Status: [[Main App (FastAPI)]] | Core Logic: [[Streaming Logic]]

## 📡 Endpoints
The backend exposes logic primarily through the `routes/ai.py` module.

### 💬 `POST /chat`
The main chat endpoint. It accepts a `ChatRequest` Pydantic model and returns a `StreamingResponse`.

#### Data Flow:
1. **Input Validation:** Parses `message`, `model`, `mode`, and `history`.
2. **Context Assembly:** Aggregates conversation history into an Ollama-compatible list.
3. **Prompt Selection:** Delegates to [[Query Modes]] to select the system prompt.
4. **Stream Generation:** Invokes [[Streaming Logic]] to fetch tokens from [[Ollama Integration]].

### 📦 ChatRequest Schema
- `message`: The user's current prompt.
- `model`: Optional target model (default: `.env`).
- `mode`: `thinking`, `research`, `web`, or `default`.
- `history`: List of previous messages for context multi-turn.
