# Global State (useChat)

Status: [[Frontend Overview]] | persistence: [[Supabase Integration]]

The `useChat` hook is the "brain" of the frontend. It manages all reactive state variables and provides methods to manipulate them.

## 💾 Managed State
- **Entities:** `user`, `chats`, `projects`, `projectChats`.
- **Navigation:** `activeChatId`, `activeProjectId`, `activeProjectChatId`.
- **Live UI:** `isThinking`, `activeMessages`, `thinkngText`.

## 🛠️ Key Methods
- **`handleSendMessage`**: Orchestrates the multi-step process of saving the user message to [[Supabase Integration]], calling the [[AI Routes|Backend API]], and streaming tokens.
- **`fetchChats`/`fetchProjects`**: Standardizes data retrieval from Supabase.
- **`handleNewChat`**: Atomic operation to create a DB record and update local state seamlessly.

## ⚡ Reactivity Flow
When a user selects a chat, an `useEffect` in `useChat.js` triggers a fetch of all messages associated with that `chatId`, updating `activeMessages` and forcing a re-render of the message thread.
