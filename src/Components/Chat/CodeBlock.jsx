import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Terminal } from "lucide-react";

// Language display names & terminal dot colors
const LANG_META = {
  javascript: { label: "JavaScript", color: "#f7df1e" },
  js: { label: "JavaScript", color: "#f7df1e" },
  jsx: { label: "JSX", color: "#61dafb" },
  typescript: { label: "TypeScript", color: "#3178c6" },
  ts: { label: "TypeScript", color: "#3178c6" },
  tsx: { label: "TSX", color: "#3178c6" },
  python: { label: "Python", color: "#3776ab" },
  py: { label: "Python", color: "#3776ab" },
  java: { label: "Java", color: "#ed8b00" },
  c: { label: "C", color: "#a8b9cc" },
  cpp: { label: "C++", color: "#00599c" },
  csharp: { label: "C#", color: "#239120" },
  cs: { label: "C#", color: "#239120" },
  go: { label: "Go", color: "#00add8" },
  rust: { label: "Rust", color: "#dea584" },
  ruby: { label: "Ruby", color: "#cc342d" },
  php: { label: "PHP", color: "#777bb3" },
  swift: { label: "Swift", color: "#fa7343" },
  kotlin: { label: "Kotlin", color: "#7f52ff" },
  html: { label: "HTML", color: "#e34c26" },
  css: { label: "CSS", color: "#264de4" },
  scss: { label: "SCSS", color: "#cc6699" },
  sql: { label: "SQL", color: "#e38c00" },
  bash: { label: "Bash", color: "#4eaa25" },
  shell: { label: "Shell", color: "#4eaa25" },
  sh: { label: "Shell", color: "#4eaa25" },
  json: { label: "JSON", color: "#5b5b5b" },
  yaml: { label: "YAML", color: "#cb171e" },
  yml: { label: "YAML", color: "#cb171e" },
  xml: { label: "XML", color: "#f16529" },
  markdown: { label: "Markdown", color: "#ffffff" },
  md: { label: "Markdown", color: "#ffffff" },
  docker: { label: "Dockerfile", color: "#2496ed" },
  dockerfile: { label: "Dockerfile", color: "#2496ed" },
  graphql: { label: "GraphQL", color: "#e535ab" },
  lua: { label: "Lua", color: "#000080" },
  r: { label: "R", color: "#276dc3" },
  dart: { label: "Dart", color: "#0175c2" },
  powershell: { label: "PowerShell", color: "#5391fe" },
};

// Customized dark terminal theme based on One Dark
const terminalTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "transparent",
    margin: 0,
    padding: "1rem 1.25rem",
    fontSize: "13.5px",
    lineHeight: "1.7",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', monospace",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', monospace",
    fontSize: "13.5px",
    lineHeight: "1.7",
  },
};

export default function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const code = String(children).replace(/\n$/, "");
  const lang = language?.toLowerCase() || "";
  const meta = LANG_META[lang] || {
    label: lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : "Code",
    color: "#a78bfa",
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden my-3 w-full max-w-full bg-[#1a1b26] border border-white/6
                 shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.03)_inset,0_1px_0_rgba(255,255,255,0.04)_inset]
                 transition-shadow duration-300
                 hover:shadow-[0_8px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_1px_0_rgba(255,255,255,0.06)_inset]"
    >
      {/* ── Terminal Title Bar ── */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 select-none border-b border-white/6
                   bg-linear-to-b from-white/6 to-white/2"
      >
        {/* macOS dots */}
        <div className="flex items-center gap-[7px]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_6px_rgba(255,95,86,0.4)] transition-transform duration-150 hover:scale-125" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_rgba(255,189,46,0.4)] transition-transform duration-150 hover:scale-125" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_6px_rgba(39,201,63,0.4)] transition-transform duration-150 hover:scale-125" />
        </div>

        {/* Language badge */}
        <div
          className="flex items-center gap-1.5 rounded-md border border-white/6 bg-white/4 px-2.5 py-[3px] text-[11.5px] font-medium tracking-[0.3px] font-mono [&>svg]:opacity-70"
          style={{ color: meta.color }}
        >
          <Terminal size={12} />
          <span>{meta.label}</span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy code"}
          className={`ml-auto flex items-center gap-[5px] rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.3px] cursor-pointer transition-all duration-200
            ${copied
              ? "text-[#27c93f] border-[rgba(39,201,63,0.3)] bg-[rgba(39,201,63,0.08)]"
              : "text-white/40 border-white/6 bg-white/4 hover:text-white/85 hover:bg-white/8 hover:border-white/12 hover:shadow-[0_0_12px_rgba(167,139,250,0.15)] active:scale-[0.96]"
            }`}
        >
          {copied ? (
            <><Check size={14} /><span>Copied!</span></>
          ) : (
            <><Copy size={14} /><span className="max-sm:hidden">Copy</span></>
          )}
        </button>
      </div>

      {/* ── Code Body ── */}
      <div
        className="relative overflow-x-auto overflow-y-auto max-h-[800px] min-h-[80px] bg-[#1a1b26]
                   [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5
                   [&::-webkit-scrollbar-track]:bg-transparent
                   [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full
                   hover:[&::-webkit-scrollbar-thumb]:bg-white/20
                   [&_pre]:m-0! [&_pre]:rounded-none! [&_pre]:bg-transparent!
                   [&_code]:bg-transparent!"
      >
        <SyntaxHighlighter
          language={lang || "text"}
          style={terminalTheme}
          showLineNumbers
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1.2em",
            color: "rgba(255,255,255,0.15)",
            fontSize: "12px",
            textAlign: "right",
            userSelect: "none",
          }}
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
