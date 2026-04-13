# Message Processing Logic

Status: [[Global State (useChat)]] | UI Display: [[Component Structure]]

Handling AI tokens in a chat app requires complex string manipulation to ensure a smooth UI experience.

## 🌊 Stream Handling
In `handleSendMessage`, we use the **Streams API** (`response.body.getReader()`). 
1. **Raw Buffer:** We accumulate binary chunks into a `rawBuffer` string.
2. **Text Decoder:** Decodes chunks into UTF-8.

## 🧠 Thinking Tags Parsing
A core feature of ChatAI is parsing `<think>` blocks on-the-fly:
- **Regex-less approach:** Uses `indexOf("<think>")` and `indexOf("</think>")` to find blocks.
- **Separation:** Content inside tags is moved to a `thinking` property of the message object.
- **Persistence:** Only the final "display" content (outside tags) is saved to [[Supabase Integration]] to keep the database response clean.

## 🕒 Real-time Updates
As chunks arrive, we map over the `activeMessages` state and update the AI message by ID:
```javascript
setActiveMessages(prev => prev.map(msg => msg.id === aiMessageId
    ? { ...msg, content: parsedContent, thinking: parsedThink }
    : msg
));
```
