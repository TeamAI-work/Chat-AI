# Ollama Integration

Status: [[Streaming Logic]] | Orchestrator: [[AI Routes]]

## 🤖 Connection
The bridge to the local LLM environment.

### 🔧 Configuration
- **Model Selection:** Defaults to the value in [[Infrastructure#Environment Variables]] if not specified by the user.
- **Client:** Uses the standard `ollama` Python library.

### 📝 Logic
- Maps frontend roles (`user`, `ai`) to backend roles (`user`, `assistant`).
- Handles the streaming chat request:
  ```python
  ollama.chat(model=model, messages=messages, stream=True)
  ```

### 🚅 Performance
Uses local inference, meaning data never leaves the host machine. Speed depends on local GPU/CPU resources.
