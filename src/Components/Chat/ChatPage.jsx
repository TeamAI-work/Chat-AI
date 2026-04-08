import { useState, useEffect } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import { Menu, Sparkle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import ThinkingModel from "./ThinkingModel";

export default function ChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [hoverIcon, setHoverIcon] = useState(false);

    // Auth
    const [user, setUser] = useState(null);

    // Regular chats (chats table → messages table)
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);

    // Projects (projects table → project-chats table stores chat sessions)
    const [projects, setProjects] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [projectChats, setProjectChats] = useState([]);           // session list for the sidebar
    const [projectChatsProjectId, setProjectChatsProjectId] = useState(null); // which project those chats belong to
    const [activeProjectChatId, setActiveProjectChatId] = useState(null);
    const [isThinking, setIsThinking] = useState(false)
    const [thinkngText, setThinkngText] = useState("")
    const [storedThinkingText, setStoredThinkingText] = useState("")

    // Shared message display
    const [activeMessages, setActiveMessages] = useState([]);

    const navigate = useNavigate();

    // ── 1. Auth guard ────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { navigate('/auth'); return; }
            setUser(session.user);
            fetchChats(session.user.id);
            fetchProjects(session.user.id);
        };
        fetchSession();
    }, [navigate]);

    // ── 2. Fetch regular chats ───────────────────────────────────────────────
    const fetchChats = async (userId) => {
        const queryUserId = userId || user?.id;
        if (!queryUserId) return;
        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq('user_id', queryUserId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            const formatted = data.map(c => ({ ...c, name: c.title }));
            setChats(formatted);
            if (formatted.length > 0) setActiveChatId(formatted[0].id);
        }
    };

    // ── 3. Fetch projects ────────────────────────────────────────────────────
    const fetchProjects = async (userId) => {
        const queryUserId = userId || user?.id;
        if (!queryUserId) return;
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', queryUserId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProjects(data.map(p => ({ ...p, name: p.project_name })));
        }
    };

    // ── 4. Load messages when a regular chat is selected ─────────────────────
    useEffect(() => {
        if (!activeChatId) return;
        const load = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', activeChatId)
                .order('created_at', { ascending: true });
            if (!error && data) setActiveMessages(data);
        };
        load();
    }, [activeChatId]);

    // ── 5. Fetch project chat list when a project is selected ─────────────────
    const fetchProjectChats = async (projectId) => {
        if (!projectId) return;
        const { data, error } = await supabase
            .from('project-chats')
            .select('id, name, created_at')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });
        if (!error && data) {
            setProjectChats(data);
            setProjectChatsProjectId(projectId); // remember which project these belong to
            if (data.length > 0) setActiveProjectChatId(data[0].id);
        }
    };

    useEffect(() => {
        if (activeProjectId) {
            fetchProjectChats(activeProjectId);
        }
    }, [activeProjectId]);

    // ── 5b. Load messages for the selected project chat session ───────────────
    //       Messages live in project-chat-messages, keyed by chat_id
    useEffect(() => {
        if (!activeProjectChatId) return;
        const load = async () => {
            const { data, error } = await supabase
                .from('project-chat-messages')
                .select('*')
                .eq('chat_id', activeProjectChatId)
                .order('created_at', { ascending: true });
            if (!error && data) setActiveMessages(data);
        };
        load();
    }, [activeProjectChatId]);

    // ── 6. Select a regular chat ─────────────────────────────────────────────
    const handleSelectChat = (chatId) => {
        setActiveChatId(chatId);
        setActiveProjectId(null);   // leave project context
        setActiveProjectChatId(null);
        setProjectChats([]);
        setProjectChatsProjectId(null);
        setActiveMessages([]);
    };

    // ── 7. Select a project (just switches context, clears chat) ─────────────
    const handleSelectProject = (projectId) => {
        if (projectId === activeProjectId) return; // already active — don't wipe the chat list
        setActiveProjectId(projectId);
        setActiveChatId(null);
        setActiveProjectChatId(null);
        setProjectChats([]);
        setActiveMessages([]);
    };

    // ── 7b. Select a specific project chat session ────────────────────────────
    const handleSelectProjectChat = (chatId) => {
        setActiveProjectChatId(chatId);
        setActiveChatId(null);
        setActiveMessages([]);
    };

    // ── 8b. Create a new chat session inside the active project ───────────────
    const handleNewProjectChat = async () => {
        if (!user || !activeProjectId) return;
        const { data, error } = await supabase
            .from('project-chats')
            .insert({ project_id: activeProjectId, name: "New Chat" })
            .select('id, name, created_at')
            .single();
        if (error) { console.error("Error creating project chat:", error); return; }
        if (data) {
            setProjectChats(prev => [data, ...prev]);
            setActiveProjectChatId(data.id);
            setActiveMessages([]);
        }
    };

    // ── 8. New regular chat ───────────────────────────────────────────────────
    const handleNewChat = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('chats')
            .insert({ user_id: user.id, title: "New Chat" })
            .select()
            .single();

        if (error) {
            console.error("Error adding chat:", error);
            alert("Database Error: " + error.message);
            return;
        }
        if (data) {
            const newChat = { ...data, name: data.title };
            setChats(prev => [newChat, ...prev]);
            handleSelectChat(newChat.id);
            if (!sidebarOpen) setSidebarOpen(true);
        }
    };

    // ── 9. New project ────────────────────────────────────────────────────────
    const handleNewProject = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('projects')
            .insert({ user_id: user.id, project_name: "New Project" })
            .select()
            .single();

        if (error) { console.error("Error adding project:", error); return; }
        if (data) {
            const newProject = { ...data, name: data.project_name };
            setProjects(prev => [newProject, ...prev]);
            handleSelectProject(newProject.id);
            if (!sidebarOpen) setSidebarOpen(true);
        }
    };

    // ── 10. Send message ──────────────────────────────────────────────────────
    const handleSendMessage = async (content, selectedModel) => {
        const inProjectContext = !!activeProjectId;
        const inChat = !!activeChatId;
        if (!inProjectContext && !inChat) return;
        if (isThinking) return;

        // ── Resolve the project chat session ─────────────────────────────────
        // If the user is in a project but hasn't selected/created a session yet,
        // auto-create one now so the first message is not lost.
        let resolvedProjectChatId = activeProjectChatId;
        if (inProjectContext && !resolvedProjectChatId) {
            const { data: newSession, error: sessionErr } = await supabase
                .from('project-chats')
                .insert({ project_id: activeProjectId, name: "New Chat" })
                .select('id, name, created_at')
                .single();

            if (sessionErr) {
                console.error("Failed to auto-create project chat session:", sessionErr);
                return;
            }
            resolvedProjectChatId = newSession.id;
            setProjectChats(prev => [newSession, ...prev]);
            setActiveProjectChatId(newSession.id);
        }

        // Optimistic UI
        const userMsg = { id: Date.now(), role: "user", content };
        setActiveMessages(prev => [...prev, userMsg]);
        setIsThinking(true);

        // Persist user message
        if (inProjectContext) {
            const { error: insertErr } = await supabase
                .from('project-chat-messages')
                .insert({ chat_id: resolvedProjectChatId, role: "user", content });
            if (insertErr) console.error("[project-chat-messages] user insert error:", insertErr);
        } else {
            await supabase.from('messages').insert({
                chat_id: activeChatId,
                role: "user",
                content,
            });
        }

        // Call AI
        try {
            console.log("[AI] Sending to model:", selectedModel, "| message:", content.slice(0, 50));
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: content, model: selectedModel }),
            });

            console.log("[AI] Response status:", response.status, response.statusText);

            if (!response.ok) {
                const errText = await response.text();
                console.error("[AI] Error body:", errText);
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;

            let rawBuffer = "";
            let finalDisplayContent = "";
            let finalThinkContent = "";
            const aiMessageId = Date.now() + 1;

            setThinkngText(""); // Reset thinking text for new message
            setStoredThinkingText("");

            let firstChunkReceived = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    if (!firstChunkReceived) {
                        setActiveMessages(prev => [...prev, { id: aiMessageId, role: "ai", content: "", thinking: "" }]);
                        setIsThinking(false);
                        firstChunkReceived = true;
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    rawBuffer += chunk;
                    
                    let parsedContent = rawBuffer;
                    let parsedThink = "";

                    let startIdx = parsedContent.indexOf("<think>");
                    while (startIdx !== -1) {
                        let endIdx = parsedContent.indexOf("</think>", startIdx);
                        if (endIdx !== -1) {
                            parsedThink += parsedContent.substring(startIdx + 7, endIdx) + "\n";
                            parsedContent = parsedContent.substring(0, startIdx) + parsedContent.substring(endIdx + 8);
                        } else {
                            parsedThink += parsedContent.substring(startIdx + 7);
                            parsedContent = parsedContent.substring(0, startIdx);
                            break;
                        }
                        startIdx = parsedContent.indexOf("<think>");
                    }
                    
                    finalDisplayContent = parsedContent;
                    finalThinkContent = parsedThink.trim();

                    setActiveMessages(prev => prev.map(msg => msg.id === aiMessageId
                        ? { ...msg, content: parsedContent, thinking: parsedThink.trim() || msg.thinking }
                        : msg
                    ));
                    if (parsedThink.trim() !== "") {
                        setThinkngText(parsedThink.trim());
                        setStoredThinkingText(parsedThink.trim());
                    }
                }
            }

            // After streaming, ensure the final content is properly trimmed and state is updated once more
            if (finalDisplayContent === "") {
                finalDisplayContent = rawBuffer; // Fallback in case something went very wrong with parsing
            }

            // Persist AI message — non-fatal, log errors but don't crash the chat
            try {
                if (inProjectContext) {
                    const { error: aiErr } = await supabase
                        .from('project-chat-messages')
                        .insert({ chat_id: resolvedProjectChatId, role: "ai", content: finalDisplayContent });
                    if (aiErr) console.error("[persist] project-chat-messages AI insert error:", aiErr);
                } else if (activeChatId) {
                    const { error: aiErr } = await supabase.from('messages').insert({
                        chat_id: activeChatId,
                        role: "ai",
                        content: finalDisplayContent,
                    });
                    if (aiErr) console.error("[persist] messages AI insert error:", aiErr);
                }
            } catch (persistErr) {
                console.error("[persist] Supabase error (non-fatal):", persistErr);
            }
        } catch (err) {
            console.error("[AI] Stream error:", err.message, err.stack);
            
            // Revert optimistic set if we added an empty message but failed immediately
            const wasEmptyRendered = activeMessages.some(m => m.id === Date.now() + 1); // rough check
            
            setActiveMessages(prev => {
                // If the last message is an empty AI response, replace it. 
                // Or simply append the error message if the previous response was already fully successful
                const last = prev[prev.length - 1];
                if (last && last.role === 'ai' && last.content === '') {
                   return prev.map((msg, i) => i === prev.length - 1 ? { ...msg, content: `⚠️ Error: ${err.message}` } : msg);
                }
                return [...prev, {
                    id: Date.now() + 1,
                    role: "ai",
                    content: `⚠️ Error: ${err.message}`,
                }];
            });
        } finally {
            setIsThinking(false);
        }
    };

    // Active chat title for header
    const activeChat = activeProjectId
        ? projects.find(p => p.id === activeProjectId) || null
        : chats.find(c => c.id === activeChatId) || null;

    if (!user) return <div className="h-screen w-screen bg-[#202123]" />;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#202123] text-gray-100 font-sans selection:bg-purple-500/30">
            {/* Sidebar */}
            <motion.div
                initial={{ width: sidebarOpen ? 280 : 72 }}
                animate={{ width: sidebarOpen ? 280 : 72 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="relative bg-[#0F0F12] shadow-2xl z-10 border-r border-white/5 flex-shrink-0 flex flex-col overflow-hidden"
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
                                className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-95 flex items-center justify-center bg-white/5 border border-white/5 shadow-sm"
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

            {/* Main Chat Area */}
            <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-[#1E1F22] to-[#25262B] relative shadow-inner">
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

                {/* Thinking Model Sidebar — slides in from the right inside the chat area */}
                <AnimatePresence>
                    {thinkngText.trim() !== "" && (
                        <motion.div
                            key="thinking-panel"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 360, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
                            className="shrink-0 h-full border-l border-white/5 bg-[#14141a] overflow-hidden"
                        >
                            <ThinkingModel text={storedThinkingText} isStreaming={isThinking} onClose={() => setThinkngText("")} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}