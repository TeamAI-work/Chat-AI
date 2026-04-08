import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, FolderClosed, LayoutGrid, LoaderPinwheelIcon, LogOut, MessageSquare, MoreHorizontal, Plus, Search, User } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { supabase } from "../../supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Sidebar({ user, setSidebarOpen, chats, projects, fetchChats, fetchProjects, fetchProjectChats, projectChats = [], projectChatsProjectId, setProjectChatsProjectId, setProjectChats, activeChatId, setActiveChatId, activeProjectId, setActiveProjectId, activeProjectChatId, setActiveProjectChatId, onNewChat, onNewProject, onNewProjectChat }) {

  const profileref = useRef(null)
  const navigate = useNavigate()
  const [profileModel, setProfileModel] = useState(false)

  // ── Close menus when clicking outside ──
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close chat options menu
      if (!event.target.closest('.chatmore-trigger') && !event.target.closest('.chatmore-menu')) {
        setChatMore(null);
      }
      
      // Close profile modal
      if (profileref.current && !profileref.current.contains(event.target)) {
        if (!event.target.closest('.profile-trigger')) {
          setProfileModel(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Auto-expand the active project when it changes ──
  useEffect(() => {
    if (activeProjectId) {
      setExpandedProjects(prev => new Set([...prev, activeProjectId]));
    }
  }, [activeProjectId]);

  const [renamingId, setRenamingId] = useState(null)
  const [renamingValue, setRenamingValue] = useState("")

  const handleRename = async ({ projectId, chatId, projectChatId, newname }) => {
    if (!newname.trim()) return; // avoid empty names
    if (projectId) {
      await supabase.from("projects").update({ project_name: newname.trim() }).eq("id", projectId)
      fetchProjects()
    }
    if (chatId) {
      await supabase.from("chats").update({ title: newname.trim() }).eq("id", chatId)
      fetchChats()
    }
    if (projectChatId) {
      await supabase.from("project-chats").update({ name: newname.trim() }).eq("id", projectChatId)
      fetchProjectChats?.(activeProjectId)
    }
    setChatMore(null);
  }

  const [searchInput, setSearchInput] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const searchLower = searchTerm.trim().toLowerCase();

  const filteredChats = searchLower
    ? chats.filter(chat => chat.name?.toLowerCase().includes(searchLower))
    : chats;

  const filteredProjects = searchLower
    ? projects.filter(project => project.name?.toLowerCase().includes(searchLower))
    : projects;

  // ── Context menu (three-dot) ──
  function ActionMenu({ projectId, chatId, projectChatId, currentName }) {

    const handleDelete = async () => {
      if (projectId) {
        await supabase.from('projects').delete().eq('id', projectId)
        fetchProjects()
        if (activeProjectId === projectId) setActiveProjectId(null);
      }
      if (chatId) {
        await supabase.from('chats').delete().eq('id', chatId)
        fetchChats()
        if (activeChatId === chatId) setActiveChatId(null);
      }
      if (projectChatId) {
        await supabase.from('project-chats').delete().eq('id', projectChatId)
        fetchProjectChats?.(activeProjectId)
        if (activeProjectChatId === projectChatId) setActiveProjectChatId(null);
      }
      setChatMore(null);
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        className="absolute top-8 right-0 bg-[#2A2B32] text-sm text-gray-200 p-1.5 rounded-xl shadow-xl border border-white/10 w-32 flex flex-col gap-1 chatmore-menu z-50 origin-top-right backdrop-blur-md"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setRenamingId(projectId || chatId || projectChatId);
            setRenamingValue(currentName || "");
            setChatMore(null);
          }}
          className="text-left hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer transition-colors w-full font-medium">Rename</button>
        <button
          onClick={() => { handleDelete() }}
          className="text-left hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg cursor-pointer transition-colors w-full font-medium">Delete</button>
      </motion.div>
    )
  }

  const [projectOpen, setProjectOpen] = useState(true)       // whole Projects section
  const [expandedProjects, setExpandedProjects] = useState(new Set()) // per-project expand
  const [chatOpen, setChatOpen] = useState(true)
  const [chatMore, setChatMore] = useState(null)

  const toggleProjectExpand = (e, projectId) => {
    e.stopPropagation();
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  return ( 
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      exit={{ opacity: 0, x: -20 }}
      className="text-white flex-col flex h-full select-none"
    >
      {/* ── Header ── */}
      <div className="px-5 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-600 to-blue-500 p-1.5 rounded-xl shadow-lg ring-1 ring-white/10">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <span className="font-semibold text-[15px] tracking-wide text-white/90">Workspace</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
          <LoaderPinwheelIcon size={20} />
        </button>
      </div>

      {/* ── Global Actions ── */}
      <div className="px-4 space-y-2 mb-8">
        <button
          onClick={onNewChat}
          className="flex justify-start items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 w-full py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 text-sm font-medium border border-blue-500/30"
        >
          <Plus size={18} strokeWidth={2.5} />
          New chat
        </button>
        <button
          onClick={onNewProject}
          className="flex justify-start items-center gap-3 bg-white/5 hover:bg-white/10 w-full py-2.5 px-4 rounded-xl transition-all text-sm font-medium border border-white/5 text-gray-300"
        >
          <Plus size={18} strokeWidth={2.5} />
          New Project
        </button>
        <button
          onClick={() => setSearchInput(true)}
          className="flex items-center justify-start gap-3 bg-white/5 hover:bg-white/10 w-full px-4 rounded-xl transition-all text-sm font-medium text-gray-300 border border-white/5 h-[42px] overflow-hidden"
        >
          <Search size={18} strokeWidth={2} className="shrink-0" />
          {searchInput ? (
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => {
                if (!searchTerm.trim()) setSearchInput(false)
              }}
              autoFocus
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent border-none text-gray-300 focus:outline-none placeholder-gray-500 font-normal"
            />
          ) : (
            <span className="truncate">Search</span>
          )}
        </button>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full px-2 space-y-6">

        {/* ── Projects Section ── */}
        <div>
          {/* Section header — collapses ALL projects */}
          <button
            onClick={() => setProjectOpen(!projectOpen)}
            className="flex w-full items-center justify-between py-1 px-3 text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1 hover:text-gray-300 transition-colors"
          >
            <span>Projects</span>
            <div className="p-1 rounded-md hover:bg-white/5 transition-colors">
              {projectOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {projectOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                {filteredProjects.map((project) => {
                  const isExpanded = expandedProjects.has(project.id);
                  const isActive = activeProjectId === project.id;

                  return (
                    <div key={project.id}>
                      {/* ── Project Row ── */}
                      <div
                        onClick={() => setActiveProjectId(project.id)}
                        className={`group flex items-center gap-1 cursor-pointer hover:bg-white/5 w-full py-2 px-2 rounded-xl transition-colors relative ${isActive ? 'bg-white/10 ring-1 ring-white/10' : ''}`}
                      >
                        {/* Per-project chevron */}
                        <button
                          onClick={(e) => {
                            toggleProjectExpand(e, project.id)
                            setActiveProjectId(project.id)
                          }}
                          className="p-0.5 rounded text-gray-500 hover:text-gray-300 transition-colors shrink-0"
                        >
                          {isExpanded
                            ? <ChevronDown size={13} />
                            : <ChevronRight size={13} />
                          }
                        </button>

                        <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
                          <FolderClosed
                            onClick={(e) => {
                              toggleProjectExpand(e, project.id)
                              setActiveProjectId(project.id)
                            }}
                            size={15}
                            className={`shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-blue-400/70 group-hover:text-blue-400'}`}
                            strokeWidth={2}
                          />
                          {renamingId === project.id ? (
                            <input
                              autoFocus
                              className="outline-none bg-transparent w-full truncate cursor-text text-sm text-white border-b border-purple-500/50 pb-[1px]"
                              type="text"
                              value={renamingValue}
                              onChange={(e) => setRenamingValue(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleRename({ projectId: project.id, newname: renamingValue });
                                  setRenamingId(null);
                                } else if (e.key === "Escape") {
                                  setRenamingId(null);
                                }
                              }}
                              onBlur={() => {
                                if (renamingValue !== project.name) {
                                  handleRename({ projectId: project.id, newname: renamingValue });
                                }
                                setRenamingId(null);
                              }}
                            />
                          ) : (
                            <span className="outline-none bg-transparent w-full truncate cursor-pointer text-sm text-gray-300 group-hover:text-gray-100 transition-colors">
                              {project.name || 'Untitled'}
                            </span>
                          )}
                        </div>

                        {/* Three-dot menu */}
                        <button
                          className="chatmore-trigger z-10 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg shrink-0 transition-all text-gray-400 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatMore(project.id === chatMore ? null : project.id);
                          }}
                        >
                          <MoreHorizontal size={15} />
                        </button>
                        <AnimatePresence>
                          {chatMore === project.id && <ActionMenu projectId={project.id} currentName={project.name} />}
                        </AnimatePresence>
                      </div>

                      {/* ── Expandable session list ── */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                            animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
                            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="ml-[22px] pl-3 border-l border-white/[0.07] py-0.5">
                              {/* + New chat inside project — only show for the active project */}
                              {isActive && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onNewProjectChat(); }}
                                  className="flex items-center gap-1.5 w-full px-2 py-1 mb-1 text-[12px] text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-white/5"
                                >
                                  <Plus size={12} strokeWidth={2.5} />
                                  <span>New chat</span>
                                </button>
                              )}

                              {/* Chat session list — shown for whichever project owns the loaded chats */}
                              {project.id === projectChatsProjectId && projectChats.length === 0 ? (
                                <p className="text-[11px] text-gray-600 px-2 py-1">No chats yet</p>
                              ) : (
                                (project.id === projectChatsProjectId ? projectChats : []).map((pc) => (
                                  <div
                                    key={pc.id}
                                    onClick={(e) => { e.stopPropagation(); setActiveProjectChatId(pc.id); }}
                                    className={`group relative flex items-center justify-between cursor-pointer w-full py-1.5 px-2.5 rounded-lg transition-colors text-[13px]
                                      ${activeProjectChatId === pc.id
                                        ? 'bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
                                      <MessageSquare size={13} className="shrink-0" strokeWidth={2} />
                                      {renamingId === pc.id ? (
                                        <input
                                          autoFocus
                                          type="text"
                                          value={renamingValue}
                                          onChange={(e) => setRenamingValue(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              handleRename({ projectChatId: pc.id, newname: renamingValue });
                                              setRenamingId(null);
                                            } else if (e.key === "Escape") {
                                              setRenamingId(null);
                                            }
                                          }}
                                          onBlur={() => {
                                            if (renamingValue !== pc.name) {
                                              handleRename({ projectChatId: pc.id, newname: renamingValue });
                                            }
                                            setRenamingId(null);
                                          }}
                                          className="bg-transparent border-none outline-none text-white w-full border-b border-purple-500/50 pb-[1px]"
                                        />
                                      ) : (
                                        <span className="truncate">{pc.name || 'Untitled'}</span>
                                      )}
                                    </div>
                                    <button
                                      className="chatmore-trigger z-10 p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg shrink-0 transition-all text-gray-400 hover:text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setChatMore(pc.id === chatMore ? null : pc.id);
                                      }}
                                    >
                                      <MoreHorizontal size={13} />
                                    </button>
                                    <AnimatePresence>
                                      {chatMore === pc.id && <ActionMenu projectChatId={pc.id} currentName={pc.name} />}
                                    </AnimatePresence>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Chats Section ── */}
        <div>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex w-full items-center justify-between py-1 px-3 text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1 hover:text-gray-300 transition-colors"
          >
            <span>Your Chats</span>
            <div className="p-1 rounded-md hover:bg-white/5 transition-colors">
              {chatOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {chatOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
                exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5"
              >
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id)
                      setExpandedProjects(new Set())
                    }}
                    className={`group flex justify-between relative items-center cursor-pointer hover:bg-white/5 w-full py-2 px-3 rounded-xl transition-colors shrink-0 ${activeChatId === chat.id ? 'bg-white/10 ring-1 ring-white/10' : ''}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                      <MessageSquare
                        size={16}
                        className={`shrink-0 transition-colors ${activeChatId === chat.id ? 'text-purple-300' : 'text-purple-400/80 group-hover:text-purple-400'}`}
                        strokeWidth={2}
                      />
                      {renamingId === chat.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={renamingValue}
                          onChange={(e) => setRenamingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleRename({ chatId: chat.id, newname: renamingValue });
                              setRenamingId(null);
                            } else if (e.key === "Escape") {
                              setRenamingId(null);
                            }
                          }}
                          onBlur={() => {
                            if (renamingValue !== chat.name) {
                              handleRename({ chatId: chat.id, newname: renamingValue });
                            }
                            setRenamingId(null);
                          }}
                          className="bg-transparent border-none outline-none text-white w-full border-b border-purple-500/50 pb-[1px]"
                        />
                      ) : (
                        <span className="truncate text-[15px] text-gray-300 group-hover:text-gray-100 transition-colors">{chat.name || 'Untitled'}</span>
                      )}
                    </div>
                    <button
                      className="chatmore-trigger z-10 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg shrink-0 transition-all text-gray-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatMore(`chat-${chat.id}` === chatMore ? null : `chat-${chat.id}`);
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    <AnimatePresence>
                      {chatMore === `chat-${chat.id}` && <ActionMenu chatId={chat.id} currentName={chat.name} />}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* ── User Profile Section ── */}
      <div className="p-4 mt-auto border-t relative border-white/5">
        <div onClick={() => setProfileModel(!profileModel)} className="profile-trigger flex items-center gap-3 w-full hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-all">
          <div className="w-9 h-9 shrink-0 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold text-[15px] shadow-lg shadow-green-500/20">
            {user?.email ? user.email.charAt(0).toUpperCase() : <User size={16} />}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[14px] font-medium text-gray-200 truncate">{user?.email || "User"}</span>
            <span className="text-[11px] text-gray-500">Free Plan</span>
          </div>
          <MoreHorizontal size={16} className="text-gray-500 hover:text-gray-300" />
        </div>

        <div className="absolute z-50">
            {
              profileModel && (
                <motion.div
                ref={profileref}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 10}}
                transition={{duration: 0.3}}
                className="absolute bottom-full left-0 mb-20 w-64 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                  <div className="p-4">
                    <div className="flex items-center flex-col gap-3">
                      <div className="w-10 h-10 shrink-0 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold text-[15px] shadow-lg shadow-green-500/20">
                        {user?.email ? user.email.charAt(0).toUpperCase() : <User size={16} />}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[14px] font-medium text-gray-200 truncate">{user?.email || "User"}</span>
                        <span className="text-[11px] text-gray-500">Free Plan</span>
                      </div>
                      <button 
                      onClick={()=>{supabase.auth.signOut(); navigate("/auth")}}
                      className="text-red-500 hover:text-red-100 flex items-center gap-2 hover:bg-red-500 p-2 rounded-lg transition-colors">
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            }
        </div>
      </div>


    </motion.div>
  )
}