import { BrainCircuit, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ThinkingModel({ text, isStreaming, onClose }) {
    const scrollRef = useRef(null);

    // Auto-scroll to bottom as new thought tokens stream in
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [text]);

    if (!text) return null;

    return (
        <div className="h-full w-full flex flex-col overflow-hidden relative selection:bg-purple-500/30">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/5 shrink-0 bg-linear-to-r from-purple-50 dark:from-purple-500/10 to-transparent backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="p-2 bg-purple-500/15 rounded-lg">
                            <BrainCircuit size={16} className="text-purple-400" />
                        </div>
                        {isStreaming && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        )}
                    </div>
                    <div>
                        <p className="text-[13px] font-semibold text-purple-700 dark:text-purple-300 leading-none">Thinking Process</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                            {isStreaming ? "Processing..." : "Completed"}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            {/* Scrollable thought content */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[12.5px] leading-[1.75] whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-400 p-4 rounded-xl bg-gray-100 dark:bg-black/25 border border-gray-200 dark:border-white/5 shadow-inner"
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                    {isStreaming && (
                        <span className="inline-block w-[2px] h-[14px] bg-purple-400 ml-0.5 align-middle animate-pulse rounded-sm" />
                    )}
                </motion.div>
            </div>
        </div>
    );
}