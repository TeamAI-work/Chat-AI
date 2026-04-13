import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link2, Check } from "lucide-react";

// ── SVG brand icons (lightweight, no extra deps) ──
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── Free-fall card animation variants ──
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.5, delay: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85, y: -60 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 22, stiffness: 300, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: 600,
    rotate: 8,
    scale: 0.7,
    transition: { type: "tween", ease: [0.55, 0, 1, 0.45], duration: 0.55 },
  },
};

export default function ShareModal({ isOpen, onClose, chatId, chatTitle }) {
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl = `${window.location.origin}/chat/${chatId || ""}`;
  const shareText = `Check out this AI conversation${chatTitle ? `: "${chatTitle}"` : ""}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const shareToX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/55 backdrop-blur-md"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-[440px] mx-4 overflow-hidden rounded-[20px] border border-white/[0.08] p-7
                        bg-gradient-to-br from-[rgba(32,33,39,0.97)] to-[rgba(22,22,28,0.98)]
                        text-[#e5e5e5]
                        shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)_inset,0_1px_0_rgba(255,255,255,0.06)_inset]"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute -top-1/2 -left-[30%] w-4/5 h-4/5 rounded-full bg-[radial-gradient(circle,rgba(27,208,150,0.08),transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-2/5 -right-1/5 w-3/5 h-3/5 rounded-full bg-[radial-gradient(circle,rgba(56,229,174,0.06),transparent_70%)]" />

            {/* ── Header ── */}
            <div className="relative z-10 flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-semibold tracking-tight text-[#f5f5f5]">
                Share conversation
              </h3>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-white/[0.06] bg-white/[0.04] text-white/45 cursor-pointer transition-all duration-200 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.12] active:scale-[0.92]"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Link Copy Row ── */}
            <div className="relative z-10 flex gap-2.5 mb-5 max-sm:flex-col">
              <div className="flex flex-1 items-center gap-2 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5">
                <Link2 size={16} className="shrink-0 text-white/35" />
                <span className="truncate text-[13px] text-white/50 font-mono">
                  {shareUrl}
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white cursor-pointer transition-all duration-200
                  ${linkCopied
                    ? "bg-gradient-to-br from-emerald-600 to-emerald-500 shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
                    : "bg-gradient-to-br from-theme-primary to-theme-secondary shadow-[0_4px_16px_rgba(27,208,150,0.3)] hover:brightness-110 hover:shadow-[0_6px_24px_rgba(27,208,150,0.4)] hover:-translate-y-px active:scale-[0.97] active:translate-y-0"
                  }`}
              >
                {linkCopied ? <><Check size={14} /> Copied!</> : "Copy link"}
              </button>
            </div>

            {/* ── Divider ── */}
            <div className="relative z-10 flex items-center gap-3.5 mb-5">
              <span className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] uppercase tracking-[1px] font-medium text-white/30">
                or share via
              </span>
              <span className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* ── Social Buttons ── */}
            <div className="relative z-10 flex gap-3 mb-5 max-sm:flex-col">
              {/* X */}
              <button
                onClick={shareToX}
                className="flex flex-1 items-center justify-center gap-2.5 rounded-[14px] border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-[13.5px] font-medium text-white/75 cursor-pointer transition-all duration-200
                           hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] active:scale-[0.97]"
              >
                <XIcon />
                <span>Post on X</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={shareToWhatsApp}
                className="flex flex-1 items-center justify-center gap-2.5 rounded-[14px] border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-[13.5px] font-medium text-white/75 cursor-pointer transition-all duration-200
                           hover:bg-[rgba(37,211,102,0.1)] hover:border-[rgba(37,211,102,0.3)] hover:text-[#25d366] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] active:scale-[0.97]"
              >
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* ── Footer Note ── */}
            <p className="relative z-10 m-0 text-center text-[11.5px] text-white/25">
              Anyone with the link can view this conversation.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
