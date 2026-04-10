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
          onClick={() => setModelChange(!modelChange)}
          className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors p-2 px-3 rounded-xl cursor-pointer text-gray-800 dark:text-gray-200 border border-transparent hover:border-gray-200 dark:hover:border-white/10 relative z-10"
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
              className={`transition-transform duration-300 text-gray-500 dark:text-gray-400 ${modelChange ? "rotate-180" : ""}`}
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
              className="absolute top-full left-0 mt-2 z-50 bg-white/95 dark:bg-[#2A2B32]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl p-2 min-w-[260px]"
            >
              <div className="flex flex-col gap-1">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className={`flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors p-3 rounded-lg cursor-pointer text-gray-800 dark:text-gray-200 relative group ${selectedModel === model.id ? "border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5" : ""}`}
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

      <div className="flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="w-full max-w-5xl mx-auto pt-4 pb-8 px-4 flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-70 animate-pulse">
              <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-4 rounded-full mb-6">
                <Sparkles size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-800 dark:text-white mb-2 tracking-wide text-center">
                How can I help you today?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Enter a prompt below to start &apos;{activeChat?.name || "New Chat"}&apos;.
              </p>
            </div>
          ) : (
            <AnimatePresence>
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
          )}

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
                <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex justify-center items-center shadow-lg shadow-purple-900/30 ring-1 ring-white/10 mt-1">
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

      {/* Sticky bottom input */}
      <div className="w-full shrink-0 px-4 pb-4 pt-4 bg-linear-to-t from-white via-white dark:from-[#1E1F22] dark:via-[#1E1F22] to-transparent">
        <ChatInput
          onSend={(val, mode) => onSendMessage(val, selectedModel, mode)}
          disabled={isThinking}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
      </div>

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