# Main App (FastAPI)

Status: [[Architecture Overview]] | Next: [[AI Routes]]

## 🚀 Entry Point (`main.py`)
The main FastAPI application instance. It handles the initial request lifecycle and global configurations.

### 💼 Key Responsibilities
- **Middleware:** Configures [[Infrastructure#CORS Configuration]] to allow frontend requests from `localhost:5173` and `localhost:5174`.
- **Router Inclusion:** Mounts the routers defined in [[AI Routes]].

### 📝 Code Reference
```python
app = FastAPI()
app.add_middleware(CORSMiddleware, ...)
app.include_router(ai_router)
```
