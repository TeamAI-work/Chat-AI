import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Plus } from "lucide-react";

export function ActionMenu({ onRename, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -5 }}
      className="absolute top-8 right-0 bg-white dark:bg-[#2A2B32] text-sm text-gray-800 dark:text-gray-200 p-1.5 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 w-32 flex flex-col gap-1 z-50 origin-top-right backdrop-blur-md"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onRename(); }}
        className="text-left hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer transition-colors w-full font-medium"
      >
        Rename
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="text-left hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 px-3 py-2 rounded-lg cursor-pointer transition-colors w-full font-medium"
      >
        Delete
      </button>
    </motion.div>
  );
}

export default function SidebarItem({
  icon: Icon,
  label,
  isActive,
  onClick,
  onRename,
  onDelete,
  children,
  className = "",
  iconColor = "text-purple-400",
  isRenaming,
  renamingValue,
  setRenamingValue,
  onRenameSubmit,
  onRenameCancel,
  onnewprojectchat,
  projctId,
  isproject,
  isExpanded
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/5 w-full py-2 px-2 rounded-xl transition-colors relative ${isActive ? 'bg-gray-200 dark:bg-white/10 ring-1 ring-gray-300 dark:ring-white/10' : ''} ${className}`}
    >
      {children}
      <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
        {Icon && <Icon size={15} className={`shrink-0 transition-colors ${isActive ? iconColor : `${iconColor}/70 group-hover:${iconColor}`}`} strokeWidth={2} />}

        {isRenaming ? (
          <input
            autoFocus
            className="outline-none bg-transparent w-full truncate cursor-text text-sm text-gray-900 dark:text-white border-b border-purple-500/50 pb-px"
            type="text"
            value={renamingValue}
            onChange={(e) => setRenamingValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") onRenameSubmit();
              else if (e.key === "Escape") onRenameCancel();
            }}
            onBlur={onRenameSubmit}
          />
        ) : (
          <span className="outline-none bg-transparent w-full truncate cursor-pointer text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
            {label || 'Untitled'}
          </span>
        )}
      </div>

      <div className="flex justify-center ">
        {isproject && isExpanded &&
          <div
            onClick={(e) => {
              e.stopPropagation();
              onnewprojectchat(projctId)
            }}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-white/10 rounded-lg shrink-0 transition-all text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Plus size={15} />
          </div>}

        <button
          className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-white/10 rounded-lg shrink-0 transition-all text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <ActionMenu
            onRename={() => { setMenuOpen(false); onRename(); }}
            onDelete={() => { setMenuOpen(false); onDelete(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
