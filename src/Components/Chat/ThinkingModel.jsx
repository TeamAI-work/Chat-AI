import React, { useState, useEffect, useRef } from "react";
import { BrainCircuit, X, Copy, Check, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "./MarkdownRenderer";

export default function ThinkingModel({ text, isStreaming, onClose }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [text]);


    if (!text) return null;

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-theme-bg-deep overflow-hidden relative selection:bg-theme-primary/30">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-theme-border shrink-0 bg-white/50 dark:bg-black/20 backdrop-blur-2xl z-10">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="p-2.5 bg-theme-primary/20 dark:bg-theme-primary/10 rounded-xl border border-theme-primary/30 dark:border-theme-primary/20 group-hover:scale-110 transition-transform">
                            <BrainCircuit size={18} className="text-theme-primary" />
                        </div>
                        {isStreaming && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-theme-primary animate-ping" />
                        )}
                        {isStreaming && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-theme-primary" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                             <h3 className="text-[14px] font-bold text-gray-900 dark:text-white tracking-tight">Thinking Process</h3>
                             {isStreaming && (
                                 <span className="flex gap-0.5">
                                     <span className="w-1 h-1 bg-theme-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                     <span className="w-1 h-1 bg-theme-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                     <span className="w-1 h-1 bg-theme-primary rounded-full animate-bounce" />
                                 </span>
                             )}
                        </div>
                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-widest">
                            {isStreaming ? "Synthesizing Response" : "Logical Path Completed"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-theme-muted hover:text-theme-text border border-gray-200 dark:border-theme-border hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 scroll-smooth
                           [&::-webkit-scrollbar]:w-1.5
                           [&::-webkit-scrollbar-track]:bg-transparent
                           [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/5
                           hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/10"
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                >
                    <div className="prose prose-sm dark:prose-invert max-w-none 
                                    text-[14px] leading-[1.8] text-gray-700 dark:text-gray-300
                                    bg-gray-50/50 dark:bg-white/[0.02] p-6 rounded-2xl border border-gray-100 dark:border-theme-border shadow-inner">
                        <MarkdownRenderer content={text} />
                        {isStreaming && (
                            <motion.span 
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="inline-block w-[6px] h-[15px] bg-theme-primary/80 ml-1.5 align-middle rounded-sm shadow-[0_0_8px_rgba(27,208,150,0.4)]" 
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
