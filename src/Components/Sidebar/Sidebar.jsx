import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, FolderClosed, LayoutGrid, LoaderPinwheelIcon, LogOut, MessageSquare, Plus, Search, User, Sun, Moon, Sparkle, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import SidebarItem from "../Sidebar/SidebarItem"; // Adjust path if needed

export default function Sidebar({
  user, setSidebarOpen, chats, projects,
  fetchChats, fetchProjects, fetchProjectChats,
  projectChats = [], projectChatsProjectId,
  activeChatId, setActiveChatId,
  activeProjectId, setActiveProjectId,
  activeProjectChatId, setActiveProjectChatId,
  onNewChat, onNewProject, onNewProjectChat
}) {
  const navigate = useNavigate();
  const profileref = useRef(null);
  const [profileModel, setProfileModel] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renamingValue, setRenamingValue] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [projectOpen, setProjectOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [hoverIcon, setHoverIcon] = useState(false);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  // Search logic
  const searchLower = searchTerm.trim().toLowerCase();
  const filteredChats = searchLower ? chats.filter(c => c.name?.toLowerCase().includes(searchLower)) : chats;
  const filteredProjects = searchLower ? projects.filter(p => p.name?.toLowerCase().includes(searchLower)) : projects;

  useEffect(() => {
    if (activeProjectId) setExpandedProjects(new Set([activeProjectId]));
  }, [activeProjectId]);

  const handleRename = async ({ projectId, chatId, projectChatId, newname }) => {
    if (!newname.trim()) return;
    if (projectId) await supabase.from("projects").update({ project_name: newname.trim() }).eq("id", projectId);
    if (chatId) await supabase.from("chats").update({ title: newname.trim() }).eq("id", chatId);
    if (projectChatId) await supabase.from("project-chats").update({ name: newname.trim() }).eq("id", projectChatId);

    // Refresh
    if (projectId) fetchProjects();
    if (chatId) fetchChats();
    if (projectChatId) fetchProjectChats?.(activeProjectId);
    setRenamingId(null);
  };

  const handleDelete = async ({ projectId, chatId, projectChatId }) => {
    if (projectId) {
      await supabase.from('projects').delete().eq('id', projectId);
      fetchProjects();
      if (activeProjectId === projectId) setActiveProjectId(null);
    }
    if (chatId) {
      await supabase.from('chats').delete().eq('id', chatId);
      fetchChats();
      if (activeChatId === chatId) setActiveChatId(null);
    }
    if (projectChatId) {
      await supabase.from('project-chats').delete().eq('id', projectChatId);
      fetchProjectChats?.(activeProjectId);
      if (activeProjectChatId === projectChatId) setActiveProjectChatId(null);
    }
  };

  return (
    <motion.div className="text-gray-900 dark:text-white flex flex-col h-full select-none">
      {/* Header */}
      <div
        className="px-5 pb-6 flex items-center justify-between">
        <div
          onClick={() => setSidebarOpen(false)}
          onMouseEnter={() => setHoverIcon(true)}
          onMouseLeave={() => setHoverIcon(false)}
          className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl cursor-pointer">
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
          {/* <span className="font-semibold text-[15px] tracking-wide text-gray-800 dark:text-white/90">Workspace</span> */}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-1.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-all">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Global Actions */}
      <div className="px-4 space-y-2 mb-8">
        <button onClick={onNewChat} className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 w-full py-2.5 px-4 rounded-xl text-sm font-medium shadow-lg shadow-blue-900/20 border border-blue-500/30">
          <Plus size={18} strokeWidth={2.5} /> New chat
        </button>
        <button onClick={onNewProject} className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 dark:bg-white/5 dark:hover:bg-white/10 w-full py-2.5 px-4 rounded-xl text-sm font-medium dark:border-white/5 dark:text-gray-300">
          <Plus size={18} strokeWidth={2.5} /> New Project
        </button>
        <div className="flex items-center gap-3 bg-gray-100 border border-gray-200 text-gray-700 dark:bg-white/5 w-full px-4 rounded-xl text-sm dark:text-gray-300 dark:border-white/5 h-[42px]">
          <Search size={18} className="shrink-0" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6 [&::-webkit-scrollbar]:hidden">

        {/* Projects */}
        <div>
          <button onClick={() => setProjectOpen(!projectOpen)} className="flex w-full items-center justify-between py-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            <span>Projects</span>
            {projectOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {projectOpen && (
            <div className="space-y-0.5">
              {filteredProjects.map(project => (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  key={project.id}>
                  <SidebarItem
                    label={project.name}
                    isproject={true}
                    isExpanded={expandedProjects.has(project.id)}
                    isActive={activeProjectId === project.id}
                    projctId = {project.id}
                    onnewprojectchat={onNewProjectChat}
                    icon={FolderClosed}
                    iconColor="text-blue-400"
                    onClick={() => {
                      const isExpanding = !expandedProjects.has(project.id);
                      setExpandedProjects(isExpanding ? new Set([project.id]) : new Set());
                      setActiveProjectId(project.id);
                      setActiveChatId(null);
                      if (isExpanding) fetchProjectChats(project.id);
                    }}
                    onRename={() => { setRenamingId(project.id); setRenamingValue(project.name); }}
                    onDelete={() => handleDelete({ projectId: project.id })}
                    isRenaming={renamingId === project.id}
                    renamingValue={renamingValue}
                    setRenamingValue={setRenamingValue}
                    onRenameSubmit={() => handleRename({ projectId: project.id, newname: renamingValue })}
                    onRenameCancel={() => setRenamingId(null)}
                  >
                    <button onClick={(e) => {
                      e.stopPropagation();
                      const isExpanding = !expandedProjects.has(project.id);
                      setExpandedProjects(isExpanding ? new Set([project.id]) : new Set());
                      if (isExpanding) {
                        fetchProjectChats(project.id);
                      }
                    }} className="p-0.5 rounded text-gray-500 hover:text-gray-300">
                      {expandedProjects.has(project.id) ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                  </SidebarItem>

                  {expandedProjects.has(project.id) && (
                    <div className="ml-5 pl-3 border-l border-gray-200 dark:border-white/5 py-1">
                      {/* {(activeProjectId === project.id || projectChatsProjectId === project.id) && (
                        <button onClick={() => onNewProjectChat(project.id)} className="flex items-center gap-2 w-full mb-2 px-2 py-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 dark:bg-gray-500/10 dark:hover:bg-white/10 rounded-lg dark:text-gray-300 dark:hover:text-gray-200">
                          <Plus size={12} /> New chat
                        </button>
                      )} */}
                      {(project.id === projectChatsProjectId ? projectChats : []).map(pc => (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SidebarItem
                            key={pc.id}
                            label={pc.name}
                            isActive={activeProjectChatId === pc.id}
                            icon={MessageSquare}
                            isproject={false}
                            iconColor="text-purple-400"
                            onClick={() => setActiveProjectChatId(pc.id, project.id)}
                            onRename={() => { setRenamingId(pc.id); setRenamingValue(pc.name); }}
                            onDelete={() => handleDelete({ projectChatId: pc.id })}
                            isRenaming={renamingId === pc.id}
                            renamingValue={renamingValue}
                            setRenamingValue={setRenamingValue}
                            onRenameSubmit={() => handleRename({ projectChatId: pc.id, newname: renamingValue })}
                            onRenameCancel={() => setRenamingId(null)}
                            className="text-[13px]"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Chats */}
        <div>
          <button onClick={() => setChatOpen(!chatOpen)} className="flex w-full items-center justify-between py-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            <span>Recent Chats</span>
            {chatOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {chatOpen && filteredChats.map(chat => (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarItem
                key={chat.id}
                label={chat.name}
                isActive={activeChatId === chat.id}
                icon={MessageSquare}
                iconColor="text-purple-400"
                onClick={() => { setActiveChatId(chat.id); setActiveProjectId(null); }}
                onRename={() => { setRenamingId(chat.id); setRenamingValue(chat.name); }}
                onDelete={() => handleDelete({ chatId: chat.id })}
                isRenaming={renamingId === chat.id}
                renamingValue={renamingValue}
                setRenamingValue={setRenamingValue}
                onRenameSubmit={() => handleRename({ chatId: chat.id, newname: renamingValue })}
                onRenameCancel={() => setRenamingId(null)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 mt-auto border-t border-gray-200 dark:border-white/5 relative">
        <div onClick={() => setProfileModel(!profileModel)} className="flex items-center gap-3 w-full hover:bg-gray-200 dark:hover:bg-white/5 p-2 rounded-xl transition-all cursor-pointer">
          <div className="w-9 h-9 bg-linear-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user?.email}</span>
            <span className="text-[11px] text-gray-500 font-bold tracking-tighter uppercase opacity-80">Free Plan</span>
          </div>
        </div>

        <AnimatePresence>
          {profileModel && (
            <motion.div
              ref={profileref}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 mb-4 w-60 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/5 rounded-xl shadow-2xl p-2 z-50 ml-4"
            >
              <button
                onClick={() => { supabase.auth.signOut(); navigate("/auth"); }}
                className="flex items-center gap-2 w-full p-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}