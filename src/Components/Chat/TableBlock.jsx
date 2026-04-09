import React from 'react';
import { Table } from 'lucide-react';

export default function TableBlock({ children }) {
  return (
    <div
      className="rounded-xl overflow-hidden my-4 w-full max-w-full bg-white dark:bg-[#1a1b26] border border-gray-200 dark:border-white/6
                 shadow-sm hover:shadow-md transition-shadow duration-300
                 dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.03)_inset,0_1px_0_rgba(255,255,255,0.04)_inset]
                 dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_rgba(255,255,255,0.06)_inset]"
    >
      {/* ── Terminal Title Bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 select-none border-b border-gray-200 dark:border-white/6
                   bg-gray-50 dark:bg-transparent dark:bg-linear-to-b dark:from-white/6 dark:to-white/2"
      >
        {/* macOS dots */}
        <div className="flex items-center gap-[7px]">
          <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-[#ff5f56] shadow-[0_0_6px_rgba(255,95,86,0.4)] transition-transform duration-150 hover:scale-125" />
          <span className="w-3 h-3 rounded-full bg-amber-400 dark:bg-[#ffbd2e] shadow-[0_0_6px_rgba(255,189,46,0.4)] transition-transform duration-150 hover:scale-125" />
          <span className="w-3 h-3 rounded-full bg-green-400 dark:bg-[#27c93f] shadow-[0_0_6px_rgba(39,201,63,0.4)] transition-transform duration-150 hover:scale-125" />
        </div>

        {/* Table badge */}
        <div
          className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-white/6 bg-white dark:bg-white/4 px-2.5 py-[3px] text-[11.5px] font-medium tracking-[0.3px] font-mono text-gray-500 dark:text-gray-300 [&>svg]:opacity-70"
        >
          <Table size={12} className="text-purple-500 dark:text-purple-400" />
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
