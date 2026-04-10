import React, { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Check, Copy, Share, User } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

const MessageBubble = memo(function MessageBubble({ msg, copiedText, onCopy, onShare, onViewThinking }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-4 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {/* {msg.role === "ai" && (
        <div className="shrink-0 w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-blue-600 flex justify-center items-center shadow-lg shadow-purple-900/30 ring-1 ring-white/10 mt-1">
          <Sparkles size={18} className="text-white" />
        </div>
      )} */}

      {/* Message Bubble */}
      <div className="min-w-0 max-w-[75%]">
        {/* View thinking chip — only for AI messages that have thinking content */}
        {msg.role === "ai" && msg.thinking && (
          <button
            onClick={() => onViewThinking?.(msg.thinking)}
            className="mb-2 flex items-center gap-1.5 text-[12px] text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 px-3 py-1 rounded-full transition-all group"
          >
            <BrainCircuit size={12} className="group-hover:rotate-12 transition-transform" />
            View thinking
          </button>
        )}

        <div
          className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm w-full overflow-x-auto
            ${msg.role === "user"
              ? "bg-linear-to-br from-gray-100 to-gray-200 dark:from-[#2D2E36] dark:to-[#25262B] text-gray-900 dark:text-gray-100 rounded-tr-sm border border-gray-300 dark:border-white/5"
              : "text-gray-900 dark:text-gray-200 rounded-tl-sm"
            }`}
        >
          <div className="whitespace-pre-wrap wrap-break-word min-w-0">
            <MarkdownRenderer content={msg.content} />
          </div>
        </div>

        <div className="mt-2 flex gap-1">
          <button
            className="p-2 rounded-xl transition-all text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
            onClick={() => onCopy(msg.content, msg.id)}
            title="Copy message"
          >
            {copiedText === msg.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
          <button
            className="p-2 rounded-xl transition-all text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
            onClick={onShare}
            title="Share message"
          >
            <Share size={16} />
          </button>
        </div>
      </div>

      {/* User Avatar */}
      {/* {msg.role === "user" && (
        <div className="shrink-0 w-9 h-9 rounded-xl bg-linear-to-tr from-gray-600 to-gray-700 flex justify-center items-center shadow-md ring-1 ring-white/10 mt-1">
          <User size={18} className="text-white" />
        </div>
      )} */}
    </motion.div>
  );
});

export default MessageBubble;