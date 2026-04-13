# Frontend Architecture Overview

Status: [[Architecture Overview]] | Core Sync: [[Global State (useChat)]]

The **ChatAI** frontend is a modern React SPA using Vite, organized around a custom hook architectural pattern. It manages complex multi-entity state (User, Chats, Projects, Messages) while maintaining high performance.

## 🧱 Layered Structure

### 1. Presentation Layer
Located in `src/Components/`, these are functional React components focus on UI/UX:
- **Sidebar:** Navigation for standard chats and nested projects.
- **Chat:** The logic-heavy message display and input area.
- **MessageBubble:** Renders markdown, code blocks, and AI thinking states.

### 2. Logic Layer ([[Global State (useChat)]])
A custom hook that encapsulates all business logic, server communication, and data persistence.

### 3. Data Layer ([[Supabase Integration]])
The bridge to **Supabase** for persistent storage and authentication.

## 🔄 Lifecycle
1. **Boot:** `App.jsx` checks the [[Supabase Integration#Authentication]] session.
2. **Setup:** If logged in, `useChat` fetches initial data from Supabase.
3. **Interactions:** User events (send msg, create project) trigger state updates + Supabase persistence.
