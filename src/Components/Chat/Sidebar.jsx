import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, FolderClosed, LayoutGrid, LoaderPinwheelIcon, MessageSquare, MoreHorizontal, Plus, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"

export default function Sidebar({ setSidebarOpen, chats, projects, fetchChats, fetchProjects, fetchProjectChats, projectChats = [], projectChatsProjectId, setProjectChatsProjectId, setProjectChats, activeChatId, setActiveChatId, activeProjectId, setActiveProjectId, activeProjectChatId, setActiveProjectChatId, onNewChat, onNewProject, onNewProjectChat }) {

  // ── Close "more" menu when clicking outside ──
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.chatmore-trigger') && !event.target.closest('.chatmore-menu')) {
        setChatMore(null);
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


  // ── Context menu (three-dot) ──
  function ActionMenu({projectId, chatId, projectChatId}) {

    const handleDelete = async () => {
      // Add optional chaining and await
      if(projectId){
        await supabase.from('projects').delete().eq('id', projectId)
        fetchProjects()
        if (activeProjectId === projectId) setActiveProjectId(null); // Clear active context if needed
      }
      if(chatId){
        await supabase.from('chats').delete().eq('id', chatId)
        fetchChats()
        if (activeChatId === chatId) setActiveChatId(null);
      }
      if(projectChatId){
        await supabase.from('project-chats').delete().eq('id', projectChatId)
        fetchProjectChats?.(activeProjectId) // Ensure we pass the id representing the context container
        if (activeProjectChatId === projectChatId) setActiveProjectChatId(null);
      }
      setChatMore(null); // Close menu
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        className="absolute top-8 right-0 bg-[#2A2B32] text-sm text-gray-200 p-1.5 rounded-xl shadow-xl border border-white/10 w-32 flex flex-col gap-1 chatmore-menu z-50 origin-top-right backdrop-blur-md"
      >
        <button className="text-left hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer transition-colors w-full font-medium">Rename</button>
        <button 
        onClick={()=>{handleDelete()}}
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
        <button className="flex items-center justify-start gap-3 bg-white/5 hover:bg-white/10 w-full py-2 px-4 rounded-xl transition-all text-sm font-medium text-gray-300 border border-white/5">
          <Search size={18} strokeWidth={2} />
          Search
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
                {projects.map((project) => {
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
                          <input
                            className="outline-none bg-transparent w-full truncate cursor-pointer text-sm text-gray-300 group-hover:text-gray-100 transition-colors focus:cursor-text focus:text-white"
                            type="text"
                            defaultValue={project.name}
                            onClick={(e) => e.stopPropagation()}
                          />
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
                          {chatMore === project.id && <ActionMenu projectId={project.id} />}
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
                                      <span className="truncate">{pc.name || 'Untitled'}</span>
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
                                      {chatMore === pc.id && <ActionMenu projectChatId={pc.id} />}
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
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5 overflow-hidden"
              >
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id)
                      setActiveProjectId(null)
                      toggleProjectExpand(new Set())
                      setActiveProjectChatId(null)
                      setProjectChats([])
                      setProjectChatsProjectId(null)
                    }}
                    className={`group flex justify-between relative items-center cursor-pointer hover:bg-white/5 w-full py-2 px-3 rounded-xl transition-colors shrink-0 ${activeChatId === chat.id ? 'bg-white/10 ring-1 ring-white/10' : ''}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                      <MessageSquare
                        size={16}
                        className={`shrink-0 transition-colors ${activeChatId === chat.id ? 'text-purple-300' : 'text-purple-400/80 group-hover:text-purple-400'}`}
                        strokeWidth={2}
                      />
                      <input
                        className={`outline-none bg-transparent w-full truncate cursor-pointer text-sm transition-colors focus:cursor-text focus:text-white ${activeChatId === chat.id ? 'text-gray-100 font-medium' : 'text-gray-300 group-hover:text-gray-100'}`}
                        type="text"
                        value={chat.name}
                        readOnly
                      />
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
                      {chatMore === `chat-${chat.id}` && <ActionMenu chatId={chat.id} />}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  )
}