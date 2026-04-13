# Component Structure

Status: [[Frontend Overview]]

The UI is divided into focused components that consume state from [[Global State (useChat)]].

## 🖼️ Main Components

### `Chat.jsx`
- **Role:** The main orchestrator of the chat view.
- **Features:** Header with model selector, scrollable message area, and [[ChatInput.jsx]].
- **Mode Switching:** Dynamically centers the input when messages are null.

### `Sidebar.jsx`
- **Role:** Handles the hierarchical navigation system.
- **Entities:** Lists `chats` and nested `projects` with their own `projectChats`.
- **Search:** Includes a live search filter for all items.

### `MessageBubble.jsx`
- **Role:** Atomic rendering of a single exchange.
- **Dependencies:** Uses `MarkdownRenderer` for content and `CodeBlock` for syntax highlighting.
- **Thinking UI:** Conditionally renders a collapse-able box for thinking states.

### `ChatInput.jsx`
- **Role:** Pure input component that triggers `onSend`.
- **Modes:** Handles UI for Thinking, Deep Research, and Web Search modes.