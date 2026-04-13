# ChatAI Architecture Overview

Welcome to the backend architecture overview of the **ChatAI** system. This documentation is designed to be browsed in Obsidian, with interconnected nodes representing the flow of data and control.

## 🧭 Core Nodes
- [[Main App (FastAPI)]]: The entry point of the server.
- [[AI Routes]]: Where the core chat logic resides.
- [[Frontend Overview]]: The structure of the React application.
- [[Supabase Integration]]: Primary data persistence and auth.
- [[Infrastructure]]: Server configuration and environment.

## 🔄 High-Level Workflow
1. Client boots up via [[Frontend Overview]] and checks session in [[Supabase Integration]].
2. User interactions are managed by [[Global State (useChat)]].
3. Requests reach the [[Main App (FastAPI)]] and are routed via [[AI Routes]].
4. Backend handles [[Streaming Logic]] with [[Ollama Integration]].
5. Frontend processes tokens via [[Message Processing Logic]] for UI display.
