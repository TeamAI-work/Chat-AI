import { useState } from "react";
import Chat from "./Chat";
import Sidebar from "../Sidebar/Sidebar";
import { Menu, Sparkle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThinkingModel from "./ThinkingModel";
import { useChat } from "../../hooks/useChat";

export default function ChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [hoverIcon, setHoverIcon] = useState(false);

    const {
        user, chats, activeChatId, projects, activeProjectId, projectChats, projectChatsProjectId, activeProjectChatId,
        isThinking, thinkngText, storedThinkingText, activeMessages,
        fetchChats, fetchProjects, fetchProjectChats, handleSelectChat, handleSelectProject, handleSelectProjectChat,
        handleNewChat, handleNewProject, handleNewProjectChat, handleSendMessage, setThinkngText, setStoredThinkingText
    } = useChat();

    // Active chat/project for header display
    const activeChat = activeProjectId
        ? projects.find(p => p.id === activeProjectId) || null
        : chats.find(c => c.id === activeChatId) || null;

    if (!user) return <div className="h-screen w-screen bg-white dark:bg-[#202123]" />;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#202123] text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/30">
            {/* Sidebar Container */}
            <motion.div
                initial={{ width: sidebarOpen ? 280 : 72 }}
                animate={{ width: sidebarOpen ? 280 : 72 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="relative bg-gray-50 dark:bg-[#0F0F12] shadow-2xl z-20 border-r border-gray-200 dark:border-white/5 flex-shrink-0 flex flex-col overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {sidebarOpen ? (
                        <motion.div
                            key="open"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="h-full w-[280px] pt-6 flex flex-col shrink-0"
                        >
                            <Sidebar
                                user={user}
                                setSidebarOpen={setSidebarOpen}
                                chats={chats}
                                projects={projects}
                                fetchChats={fetchChats}
                                fetchProjects={fetchProjects}
                                fetchProjectChats={fetchProjectChats}
                                projectChats={projectChats}
                                projectChatsProjectId={projectChatsProjectId}
                                activeChatId={activeChatId}
                                activeProjectId={activeProjectId}
                                activeProjectChatId={activeProjectChatId}
                                setActiveChatId={handleSelectChat}
                                setActiveProjectId={handleSelectProject}
                                setActiveProjectChatId={handleSelectProjectChat}
                                onNewChat={handleNewChat}
                                onNewProject={handleNewProject}
                                onNewProjectChat={handleNewProjectChat}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="closed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full w-[72px] shrink-0 flex flex-col items-center pt-6 gap-6"
                        >
                            <button
                                onClick={() => setSidebarOpen(true)}
                                onMouseEnter={() => setHoverIcon(true)}
                                onMouseLeave={() => setHoverIcon(false)}
                                className="p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95 flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-sm"
                            >
                                <AnimatePresence mode="wait">
                                    {hoverIcon ? (
                                        <motion.div key="sparkle" initial={{ opacity: 0, scale: 0.8, rotate: -45 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.8, rotate: 45 }} transition={{ duration: 0.15 }}>
                                            <Sparkle size={20} className="text-purple-400" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="menu" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                                            <Menu size={20} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-[#1E1F22] dark:to-[#25262B] relative shadow-inner">
                <div className="flex-1 flex flex-col relative overflow-hidden">
                    <Chat
                        activeChat={activeChat}
                        messages={activeMessages}
                        onSendMessage={handleSendMessage}
                        isThinking={isThinking}
                        thinkingText={thinkngText}
                        onViewThinking={(text) => {
                            setThinkngText(text);
                            setStoredThinkingText(text);
                        }}
                    />
                </div>

                {/* Thinking Sidebar */}
                <AnimatePresence>
                    {thinkngText.trim() !== "" && (
                        <motion.div
                            key="thinking-panel"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 450, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
                            className="shrink-0 h-full border-l border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#14141a] overflow-hidden shadow-2xl z-10"
                        >
                            <ThinkingModel text={storedThinkingText} isStreaming={isThinking} onClose={() => setThinkngText("")} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}