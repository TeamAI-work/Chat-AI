# Infrastructure

Status: [[Main App (FastAPI)]] | Config: [[AI Routes]]

## 🌐 Environment Variables
Stored in the `.env` file within the `backend/` directory.

- `OLLAMA_MODEL`: Defines the local model name (e.g., `llama3.2`, `deepseek-r1:8b`).

## 🛡️ CORS Configuration
Located in `main.py`. It allows the React frontend (running on Vite ports `5173` or `5174`) to communicate with the FastAPI server.

## 🚀 Server Execution
- **Command:** `uvicorn main:app --reload`
- **Host:** `localhost:8000` (default)
