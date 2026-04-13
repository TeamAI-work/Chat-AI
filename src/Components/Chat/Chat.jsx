import {
  useState,
  useRef,
  useEffect,
  useCallback
} from "react";
import {
  Sparkles,
  ChevronDown,
  LoaderCircle
} from "lucide-react";
import {
  motion,
  AnimatePresence
} from "framer-motion";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ShareModal from "./ShareModal";
import { MODELS, DEFAULT_MODEL } from "../../config/models";

// ─── Main Chat component ──────────────────────────────────────────────────────
export default function Chat({ activeChat, messages = [], onSendMessage, isThinking = false, thinkingText, onViewThinking }) {
  const endOfMessagesRef = useRef(null);
  const [copiedText, setCopiedText] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [modelChange, setModelChange] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL.id);
  const models = MODELS;

  const modelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setModelChange(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="py-5 pl-5 relative flex gap-2.5 text-center align-middle items-center select-none">
        <div
          ref={modelRef}
          onClick={() => setModelChange(!modelChange)}
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors p-2 px-3 rounded-xl cursor-pointer text-gray-800 dark:text-gray-200 border border-transparent hover:border-theme-border relative z-10"
        >
          <div className="text-[18px] font-medium flex items-center gap-2">
            Chat AI
            <span className="text-[12px] font-normal text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
              {MODELS.find(m => m.id === selectedModel)?.shortName || ""}
            </span>
          </div>
          <div>
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 text-theme-muted ${modelChange ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        <AnimatePresence>
          {modelChange && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.2 }}
              ref={modelRef}
              className="absolute top-full left-0 mt-2 z-50 bg-white/95 dark:bg-theme-surface/95 backdrop-blur-xl border border-theme-border rounded-xl shadow-2xl p-2 min-w-[260px]"
            >
              <div className="flex flex-col gap-1">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className={`flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors p-3 rounded-lg cursor-pointer text-gray-800 dark:text-gray-200 relative group ${selectedModel === model.id ? "border border-theme-border bg-gray-50 dark:bg-white/5" : ""}`}
                    onClick={() => { setModelChange(false); setSelectedModel(model.id); }}
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[14px] font-medium text-gray-900 dark:text-white">{model.name}</span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                        {model.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 w-full overflow-hidden relative flex flex-col">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col items-center justify-center px-4 w-full"
            >
              <div className="w-full max-w-3xl flex flex-col items-center gap-8 -translate-y-12">
                <div className="flex flex-col items-center opacity-80">
                  <motion.div
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-linear-to-tr from-theme-primary to-theme-secondary p-5 rounded-3xl mb-6 shadow-xl shadow-theme-primary/20"
                  >
                    <Sparkles size={48} className="text-white" />
                  </motion.div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight text-center">
                    How can I help you today?
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-center text-lg font-medium">
                    Start a new conversation or ask me anything.
                  </p>
                </div>

                <div className="w-full">
                  <ChatInput
                    onSend={(val, mode) => onSendMessage(val, selectedModel, mode)}
                    disabled={isThinking}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col w-full overflow-hidden"
            >
              <div className="flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="w-full max-w-3xl mx-auto pt-4 pb-8 px-4 flex flex-col gap-6">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        msg={msg}
                        copiedText={copiedText}
                        onCopy={copyToClipboard}
                        onShare={openShare}
                        onViewThinking={onViewThinking}
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
                        className="flex gap-4 w-full justify-start items-start"
                      >
                        <div className="shrink-0 w-9 h-9 rounded-xl bg-linear-to-tr from-theme-primary to-theme-secondary flex justify-center items-center shadow-lg shadow-theme-primary/30 ring-1 ring-white/10 mt-1">
                          <Sparkles size={18} className="text-white" />
                        </div>
                        <div className="flex items-center gap-2 px-5 py-4 rounded-2xl rounded-tl-sm">
                          <LoaderCircle size={18} className="text-gray-800 dark:text-white animate-spin transition-all duration-300" />
                          <span className="text-gray-800 dark:text-white animate-pulse">Thinking...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={endOfMessagesRef} className="h-4" />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full shrink-0 px-4 pb-3 pt-2 bg-linear-to-t from-theme-bg via-theme-bg to-transparent"
              >
                <ChatInput
                  onSend={(val, mode) => onSendMessage(val, selectedModel, mode)}
                  disabled={isThinking}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky bottom input */}

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