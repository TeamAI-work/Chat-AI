import React from 'react';
import { Table } from 'lucide-react';

export default function TableBlock({ children }) {
  return (
    <div
      className="rounded-xl overflow-hidden my-4 w-full max-w-full bg-gray-500/2 dark:bg-[#1a1b26] border border-gray-200 dark:border-theme-border
                 shadow-sm hover:shadow-md transition-shadow duration-300
                 dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.03)_inset,0_1px_0_rgba(255,255,255,0.04)_inset]
                 dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_rgba(255,255,255,0.06)_inset]"
    >
      {/* ── Terminal Title Bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 select-none border-b border-gray-200 dark:border-theme-border
                   bg-gray-500/2 dark:bg-transparent dark:bg-linear-to-b dark:from-white/6 dark:to-white/2"
      >

        {/* Table badge */}
        <div
          className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-white/6 bg-gray-500/2 dark:bg-white/4 px-2.5 py-[3px] text-[11.5px] font-medium tracking-[0.3px] font-mono text-gray-500 dark:text-gray-300 [&>svg]:opacity-70"
        >
          <Table size={12} className="text-theme-primary" />
          <span>Data Table</span>
        </div>
      </div>

      {/* ── Table Content ── */}
      <div
        className="relative overflow-x-auto overflow-y-auto max-h-[800px] p-5
                   [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2
                   [&::-webkit-scrollbar-track]:bg-transparent
                   [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full
                   hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
      >
        <table className="w-full border-collapse table-auto text-sm text-gray-900 dark:text-gray-100">
          {children}
        </table>
      </div>
    </div>
  );
}
