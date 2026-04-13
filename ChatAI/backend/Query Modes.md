# Query Modes

Status: [[AI Routes]]

The application supports specialized assistant behaviors by injecting specific `system` prompts at the start of the message list.

| Mode | System Prompt Personality |
| :--- | :--- |
| **Default** | Helpful and concise AI assistant. |
| **Thinking** | Highly analytical; provides deep step-by-step reasoning. |
| **Research** | Research expert; provides comprehensive, verified info. |
| **Web** | Focuses on up-to-date information and real-time relevance. |

## 🛠️ Implementation
The mode is passed as a string in the chat request. The backend uses a simple `if/elif` block to select the corresponding `custome_msg`.
