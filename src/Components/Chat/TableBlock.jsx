export default function TableBlock({ children }) {
  return (
    <div
      className="rounded-xl overflow-hidden my-3 w-full max-w-full bg-[#1a1b26] border border-white/6
                 shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.03)_inset,0_1px_0_rgba(255,255,255,0.04)_inset]
                 transition-shadow duration-300
                 hover:shadow-[0_8px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_rgba(255,255,255,0.06)_inset]"
    >
      {/* ── Table Content ── */}
      <div
        className="relative overflow-x-auto overflow-y-auto max-h-[800px] bg-[#1a1b26] p-5
                   [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5
                   [&::-webkit-scrollbar-track]:bg-transparent
                   [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full
                   hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
      >
        <table className="w-full border-collapse table-auto">
          {children}
        </table>
      </div>
    </div>
  );
}
