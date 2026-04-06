import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  memo,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  Send,
  Paperclip,
  User,
  Mic,
  Sparkles,
  Copy,
  Check,
  Share,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import TableBlock from "./TableBlock";
import ShareModal from "./ShareModal";

const TableContext = createContext(false);

// ─── Markdown component map (stable reference via useMemo per message) ───────
function useMarkdownComponents() {
  return useMemo(
    () => ({
      code({ node, inline, className, children, ...props }) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const inTable = useContext(TableContext);
        const match = /language-(\w+)/.exec(className || "");
        if (!inline || inTable) {
          const lang = match ? match[1] : "text";
          return <CodeBlock language={lang}>{children}</CodeBlock>;
        }
        return (
          <code
            className="font-mono text-[0.875em] bg-[rgba(167,139,250,0.12)] text-[#c4b5fd] px-[7px] py-[2px] rounded-[5px] border border-[rgba(167,139,250,0.15)] font-medium whitespace-nowrap max-h-[100px] overflow-y-auto"
            {...props}
          >
            {children}
          </code>
        );
      },
      ul({ children }) {
        return (
          <ul className="my-2 p-0 list-none flex flex-col gap-1.5 [&_ul]:mt-1 [&_ul]:mb-1 [&_ul]:ml-2 [&_ul]:pl-3 [&_ul]:border-l-2 [&_ul]:border-[rgba(167,139,250,0.12)]">
            {children}
          </ul>
        );
      },
      ol({ children }) {
        return (
          <ol className="my-2 p-0 list-none flex flex-col gap-1.5 [&_ol]:mt-1 [&_ol]:mb-1 [&_ol]:ml-2 [&_ol]:pl-3 [&_ol]:border-l-2 [&_ol]:border-[rgba(167,139,250,0.12)]">
            {children}
          </ol>
        );
      },
      li({ children, index, ordered }) {
        return (
          <li className="flex items-start gap-2.5 px-2.5 py-[5px] rounded-lg list-none transition-colors hover:bg-white/3">
            {ordered ? (
              <span className="shrink-0 min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-semibold text-[#c4b5fd] bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.15)] rounded-md font-mono tracking-[-0.3px] mt-px">
                {`${(index ?? 0) + 1}.`}
              </span>
            ) : (
              <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-linear-to-br from-[#a78bfa] to-[#818cf8] shadow-[0_0_6px_rgba(167,139,250,0.35)]" />
            )}
            <span className="flex-1 leading-[1.6]">{children}</span>
          </li>
        );
      },
      table({ children }) {
        return (
          <TableContext.Provider value={true}>
            <TableBlock>{children}</TableBlock>
          </TableContext.Provider>
        );
      },
      tr({ children }) {
        return <tr className="border-b border-white/6 last:border-b-0">{children}</tr>;
      },
      td({ children }) {
        return <td className="px-3 py-2 text-left border-r border-white/6 last:border-r-0">{children}</td>;
      },
      th({ children }) {
        return <th className="px-3 py-2 text-left border-r border-white/6 last:border-r-0 bg-white/4 font-semibold text-[#c4b5fd]">{children}</th>;
      },
    }),
    [] // stable — never needs to change
  );
}

// ─── Single message bubble (memoised — only re-renders if its own props change) ─
const MessageBubble = memo(function MessageBubble({ msg, copiedText, onCopy, onShare }) {
  const mdComponents = useMarkdownComponents();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-4 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {msg.role === "ai" && (
        <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex justify-center items-center shadow-lg shadow-purple-900/30 ring-1 ring-white/10 mt-1">
          <Sparkles size={18} className="text-white" />
        </div>
      )}

      {/* Message Bubble */}
      <div className="min-w-0 max-w-[75%]">
        <div
          className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm w-full overflow-x-auto
            ${msg.role === "user"
              ? "bg-gradient-to-br from-[#2D2E36] to-[#25262B] text-gray-100 rounded-tr-sm border border-white/5"
              : "text-gray-200 rounded-tl-sm"
            }`}
        >
          <div className="whitespace-pre-wrap break-words min-w-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {msg.content}
            </ReactMarkdown>
          </div>
        </div>

        <div className="mt-2">
          <button
            className="p-2 rounded-xl mb-1 ml-1 transition-all text-gray-500 hover:text-white"
            onClick={() => onCopy(msg.content, msg.id)}
            title="Copy message"
          >
            {copiedText === msg.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
          <button
            className="p-2 rounded-xl mb-1 ml-1 transition-all text-gray-500 hover:text-white"
            onClick={onShare}
            title="Share message"
          >
            <Share size={16} />
          </button>
        </div>
      </div>

      {/* User Avatar */}
      {msg.role === "user" && (
        <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-gray-600 to-gray-700 flex justify-center items-center shadow-md ring-1 ring-white/10 mt-1">
          <User size={18} className="text-white" />
        </div>
      )}
    </motion.div>
  );
});

// ─── Input box — isolated component with its OWN state ───────────────────────
// Typing here never causes the message list to re-render.
const ChatInput = memo(function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = value.trim() === "";

  return (
    <div className="max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-[#2A2B32]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-end gap-2 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all"
      >
        <button className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors shrink-0">
          <Paperclip size={20} />
        </button>

        <textarea
          rows={1}
          placeholder="Message Chat AI..."
          className="w-full bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none overflow-y-auto max-h-40 min-h-[44px] py-3 text-[15px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSend}
          disabled={disabled}
          className={`p-3 rounded-xl transition-all shadow-lg shrink-0 disabled:opacity-50 disabled:cursor-not-allowed
            ${isEmpty || disabled
              ? "text-gray-400 hover:text-white hover:bg-white/5 bg-transparent shadow-none"
              : "text-white bg-gradient-to-tr from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 active:scale-95"
            }`}
        >
          {isEmpty ? <Mic size={20} /> : <Send size={20} className="ml-0.5" />}
        </button>
      </motion.div>

      <div className="text-center mt-3">
        <span className="text-[11px] text-gray-500 font-medium">
          Chat AI can make mistakes. Consider verifying critical information.
        </span>
      </div>
    </div>
  );
});

// ─── Main Chat component ──────────────────────────────────────────────────────
export default function Chat({ activeChat, messages = [], onSendMessage, isThinking = false }) {
  const endOfMessagesRef = useRef(null);
  const [copiedText, setCopiedText] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const copyToClipboard = useCallback(async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  }, []);

  const openShare = useCallback(() => setShareOpen(true), []);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {messages.length === 0 ? (
        // Centered "New Chat" View
        <div className="flex-1 flex flex-col items-center justify-center w-full px-4 mb-20">
          <div className="flex flex-col items-center justify-center opacity-70 animate-pulse mb-8">
            <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-4 rounded-full mb-6">
              <Sparkles size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-light text-white mb-2 tracking-wide text-center">
              How can I help you today?
            </h2>
            <p className="text-gray-400 text-center">
              Enter a prompt below to start &apos;{activeChat?.name || "New Chat"}&apos;.
            </p>
          </div>
          <div className="w-full">
            <ChatInput onSend={onSendMessage} disabled={isThinking} />
          </div>
        </div>
      ) : (
        // Active "Ongoing Chat" View
        <>
          <div className="flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="w-full max-w-5xl mx-auto pt-8 pb-8 px-4 flex flex-col gap-6">
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    copiedText={copiedText}
                    onCopy={copyToClipboard}
                    onShare={openShare}
                  />
                ))}
              </AnimatePresence>

              {/* AI Thinking Bubble */}
              <AnimatePresence>
                {isThinking && (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex gap-4 w-full justify-start"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex justify-center items-center shadow-lg shadow-purple-900/30 ring-1 ring-white/10 mt-1">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-[#202123]/60 backdrop-blur-md border border-white/5 shadow-sm flex items-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="block w-2 h-2 rounded-full bg-gradient-to-tr from-purple-400 to-blue-400"
                          animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: i * 0.18,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={endOfMessagesRef} className="h-4" />
            </div>
          </div>

          {/* Sticky bottom input */}
          <div className="w-full shrink-0 px-4 pb-2 pt-10 bg-gradient-to-t from-[#1E1F22] via-[#1E1F22] to-transparent">
            <ChatInput onSend={onSendMessage} disabled={isThinking} />
          </div>
        </>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        chatId={activeChat?.id}
        chatTitle={activeChat?.name}
      />
    </div>
  );
}