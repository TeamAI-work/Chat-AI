# Supabase Integration

Status: [[Frontend Overview]] | Used by: [[Global State (useChat)]]

Supabase provides the backend-as-a-service (BaaS) layer, handling long-term persistence that isn't handled by the local [[Ollama Integration]].

## 🔐 Authentication
Uses **Supabase Auth** via `supabase.auth.getSession()`.
- Routes are protected via basic redirect logic in `useChat`.
- User profiles are automatically managed via the `user_id` foreign key.

## 🗄️ Database Schema (Tables)
1. **`chats`**: Top-level independent conversations.
2. **`messages`**: Messages linked to standard `chats`.
3. **`projects`**: Folders for grouping logical work.
4. **`project-chats`**: Chats nested inside a specific project.
5. **`project-chat-messages`**: Messages linked to specific project chats.

## ⚙️ Client Config (`supabaseClient.js`)
Initialized with your **Supabase URL** and **Anon Key** from `.env.local`.

```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🏗️ Persistence Logic
Messages are saved **twice** per turn:
1. **Immediate:** User message is inserted into Supabase before the AI call.
2. **Final:** Once the AI stream is complete, the full AI response is saved to the relevant message table.
