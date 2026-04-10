import React, { useState, useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Send, Plus, Paperclip, Lightbulb, Telescope, Globe, X } from "lucide-react";
import { FEATURE_MODELS } from "../../config/models";

const ChatInput = memo(function ChatInput({ onSend, disabled, selectedModel, setSelectedModel }) {
  const [value, setValue] = useState("");
  const [uploadModel, setUploadModel] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [deepThinking, setDeepThinking] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const uploadRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    const mode = thinking ? "thinking" : deepThinking ? "research" : webSearch ? "web" : "default";
    onSend(value, mode);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = value.trim() === "";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (uploadRef.current && !uploadRef.current.contains(event.target)) {
        setUploadModel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-3xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white/80 dark:bg-[#2A2B32]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full px-2 py-1 shadow-2xl focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
        <div className="relative flex items-center justify-between gap-2">
          <button
            onClick={() => setUploadModel(!uploadModel)}
            className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors shrink-0"
          >
            <Plus size={20} />
          </button>

          <textarea
            autoFocus
            rows={1}
            placeholder="Message Chat AI..."
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 resize-none outline-none overflow-y-auto max-h-40 min-h-[44px] py-2.5 text-[15px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={handleSend}
            disabled={disabled}
            className={` p-2.5 rounded-full flex justify-center items-center transition-all shadow-lg shrink-0 disabled:opacity-50 disabled:cursor-not-allowed
            ${isEmpty || disabled
                ? "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 bg-transparent shadow-none"
                : "text-white bg-linear-to-tr from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 active:scale-95"
              }`}
          >
            <Send size={20} />
          </button>

          <div
            ref={uploadRef}
            className={`absolute ${uploadModel ? "" : "hidden"} -top-52 px-3 py-4 left-0 bg-white dark:bg-[#2c2c31] border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex flex-col gap-2 z-50 transition-all text-gray-800 dark:text-gray-200`}
          >
            <div>
              <input id="file-upload" type="file" className="hidden" accept=".jpg, .png, .jpeg" />
              <label htmlFor="file-upload" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/10 px-2 py-1 rounded-lg cursor-pointer">
                <Paperclip size={15} /> Add Photos & Files
              </label>
            </div>
            <div className="w-full h-px bg-gray-200 dark:bg-white/20" />
            <div
              onClick={() => {
                setDeepThinking(false);
                if (!thinking) {
                  setThinking(true);
                  setSelectedModel(FEATURE_MODELS.THINKING);
                  setUploadModel(false);
                }
              }}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/10 px-2 py-1 rounded-lg cursor-pointer"
            >
              <Lightbulb size={15} /> Thinking
            </div>
            <div
              onClick={() => {
                setThinking(false);
                if (!deepThinking) {
                  setDeepThinking(true);
                  setSelectedModel(FEATURE_MODELS.RESEARCH);
                  setUploadModel(false);
                }
              }}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/10 px-2 py-1 rounded-lg cursor-pointer"
            >
              <Telescope size={15} /> Deep Research
            </div>
            <div
              onClick={() => {
                if (!webSearch) {
                  setWebSearch(true);
                  setSelectedModel(FEATURE_MODELS.WEB_SEARCH);
                  setUploadModel(false);
                }
              }}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/10 px-2 py-1 rounded-lg cursor-pointer"
            >
              <Globe size={15} /> Web Search
            </div>
          </div>
        </div>
        {(thinking || deepThinking || webSearch) && (
          <div className="flex justify-start gap-2 shrink mt-2 px-2 pb-1">
            {thinking && (
              <div className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 px-2 py-1 rounded-full bg-purple-500/30 cursor-pointer text-xs dark:text-gray-100">
                <Lightbulb size={14} /> Thinking
                <X size={14} onClick={() => { setThinking(false); setSelectedModel(FEATURE_MODELS.DEFAULT); }} />
              </div>
            )}
            {deepThinking && (
              <div className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 px-2 py-1 rounded-full bg-green-500/30 cursor-pointer text-xs dark:text-gray-100">
                <Telescope size={14} /> Deep Research
                <X size={14} onClick={() => { setDeepThinking(false); setSelectedModel(FEATURE_MODELS.DEFAULT); }} />
              </div>
            )}
            {webSearch && (
              <div className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 px-2 py-1 rounded-full bg-blue-500/30 cursor-pointer text-xs dark:text-gray-100">
                <Globe size={14} /> Web Search
                <X size={14} onClick={() => { setWebSearch(false); setSelectedModel(FEATURE_MODELS.DEFAULT); }} />
              </div>
            )}
          </div>
        )}
      </motion.div>
      <div className="text-center mt-3">
        <span className="text-[11px] text-gray-500 font-medium">
          Chat AI can make mistakes. Consider verifying critical information.
        </span>
      </div>
    </div>
  );
});

export default ChatInput;
