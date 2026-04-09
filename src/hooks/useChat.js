import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export function useChat() {
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [projectChats, setProjectChats] = useState([]);
    const [projectChatsProjectId, setProjectChatsProjectId] = useState(null);
    const [activeProjectChatId, setActiveProjectChatId] = useState(null);
    const [isThinking, setIsThinking] = useState(false);
    const [thinkngText, setThinkngText] = useState("");
    const [storedThinkingText, setStoredThinkingText] = useState("");
    const [activeMessages, setActiveMessages] = useState([]);
    const navigate = useNavigate();

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
            if (formatted.length > 0 && !activeChatId && !activeProjectId) {
                setActiveChatId(formatted[0].id);
            }
        }
    };

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

    const fetchProjectChats = async (projectId) => {
        if (!projectId) return;
        const { data, error } = await supabase
            .from('project-chats')
            .select('id, name, created_at')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });
        if (!error && data) {
            setProjectChats(data);
            setProjectChatsProjectId(projectId);
            if (data.length > 0 && !activeProjectChatId) {
                setActiveProjectChatId(data[0].id);
            }
        }
    };

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

    useEffect(() => {
        if (activeProjectId) {
            fetchProjectChats(activeProjectId);
        }
    }, [activeProjectId]);

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

    const handleSelectChat = (chatId) => {
        setActiveChatId(chatId);
        setActiveProjectId(null);
        setActiveProjectChatId(null);
        setActiveMessages([]);
    };

    const handleSelectProject = (projectId) => {
        if (projectId === activeProjectId) return;
        setActiveProjectId(projectId);
        setActiveChatId(null);
        setActiveProjectChatId(null);
        setActiveMessages([]);
    };

    const handleSelectProjectChat = (chatId, parentProjectId) => {
        setActiveProjectChatId(chatId);
        if (parentProjectId) setActiveProjectId(parentProjectId);
        setActiveChatId(null);
        setActiveMessages([]);
    };

    const handleNewChat = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('chats')
            .insert({ user_id: user.id, title: "New Chat" })
            .select()
            .single();

        if (!error && data) {
            const newChat = { ...data, name: data.title };
            setChats(prev => [newChat, ...prev]);
            handleSelectChat(newChat.id);
        }
    };

    const handleNewProject = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('projects')
            .insert({ user_id: user.id, project_name: "New Project" })
            .select()
            .single();

        if (!error && data) {
            const newProject = { ...data, name: data.project_name };
            setProjects(prev => [newProject, ...prev]);
            handleSelectProject(newProject.id);
        }
    };

    const handleNewProjectChat = async (projectId) => {
        const targetProjectId = projectId || activeProjectId;
        if (!user || !targetProjectId) return;
        const { data, error } = await supabase
            .from('project-chats')
            .insert({ project_id: targetProjectId, name: "New Chat" })
            .select('id, name, created_at')
            .single();
        if (!error && data) {
            setProjectChats(prev => [data, ...prev]);
            setActiveProjectChatId(data.id);
            setActiveMessages([]);
        }
    };

    const handleSendMessage = async (content, selectedModel, responseType) => {
        const isProjectMode = !!activeProjectId || !!activeProjectChatId;
        const isStandardMode = !!activeChatId;

        if (!isProjectMode && !isStandardMode) return;
        if (isThinking) return;

        let resolvedProjectChatId = activeProjectChatId;
        if (isProjectMode && !resolvedProjectChatId) {
            const { data: newSession, error: sessionErr } = await supabase
                .from('project-chats')
                .insert({ project_id: activeProjectId, name: "New Chat" })
                .select('id, name, created_at')
                .single();

            if (sessionErr) return;
            resolvedProjectChatId = newSession.id;
            setProjectChats(prev => [newSession, ...prev]);
            setActiveProjectChatId(newSession.id);
        }

        const userMsg = { id: Date.now(), role: "user", content };
        setActiveMessages(prev => [...prev, userMsg]);
        setIsThinking(true);

        if (isProjectMode) {
            await supabase.from('project-chat-messages').insert({ chat_id: resolvedProjectChatId, role: "user", content });
        } else {
            await supabase.from('messages').insert({ chat_id: activeChatId, role: "user", content });
        }

        const history = activeMessages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        try {
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: content, 
                    model: selectedModel, 
                    mode: responseType,
                    history: history 
                }),
            });

            if (!response.ok) throw new Error("AI call failed");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;
            let rawBuffer = "";
            let finalDisplayContent = "";
            const aiMessageId = Date.now() + 1;

            setThinkngText("");
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

            if (finalDisplayContent === "") finalDisplayContent = rawBuffer;

            if (isProjectMode) {
                await supabase.from('project-chat-messages').insert({ chat_id: resolvedProjectChatId, role: "ai", content: finalDisplayContent });
            } else if (activeChatId) {
                await supabase.from('messages').insert({ chat_id: activeChatId, role: "ai", content: finalDisplayContent });
            }
        } catch (err) {
            console.error("AI Stream error:", err);
            setActiveMessages(prev => [...prev, { id: Date.now() + 2, role: "ai", content: `⚠️ Error: ${err.message}` }]);
        } finally {
            setIsThinking(false);
        }
    };

    return {
        user, chats, activeChatId, projects, activeProjectId, projectChats, projectChatsProjectId, activeProjectChatId,
        isThinking, thinkngText, storedThinkingText, activeMessages,
        fetchChats, fetchProjects, fetchProjectChats, handleSelectChat, handleSelectProject, handleSelectProjectChat,
        handleNewChat, handleNewProject, handleNewProjectChat, handleSendMessage, setThinkngText, setStoredThinkingText
    };
}
