import React, { useContext, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import TableBlock from "./TableBlock";

export const TableContext = React.createContext(false);

export function useMarkdownComponents() {
  return useMemo(
    () => ({
      code({ node, inline, className, children, ...props }) {
        const inTable = useContext(TableContext);
        const match = /language-(\w+)/.exec(className || "");
        if (!inline || inTable) {
          const lang = match ? match[1] : "text";
          return <CodeBlock language={lang}>{children}</CodeBlock>;
        }
        return (
          <code
            className="font-mono text-[0.875em] bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 px-[7px] py-[2px] rounded-[5px] border border-purple-200 dark:border-purple-500/15 font-medium whitespace-nowrap max-h-[100px] overflow-y-auto"
            {...props}
          >
            {children}
          </code>
        );
      },
      ul({ children }) {
        return (
          <ul className="my-2 p-0 list-none flex flex-col gap-1.5 [&_ul]:mt-1 [&_ul]:mb-1 [&_ul]:ml-2 [&_ul]:pl-3 [&_ul]:border-l-2 [&_ul]:border-purple-200 dark:[&_ul]:border-purple-500/15">
            {children}
          </ul>
        );
      },
      ol({ children }) {
        return (
          <ol className="my-2 p-0 list-none flex flex-col gap-1.5 [&_ol]:mt-1 [&_ol]:mb-1 [&_ol]:ml-2 [&_ol]:pl-3 [&_ol]:border-l-2 [&_ol]:border-purple-200 dark:[&_ol]:border-purple-500/15">
            {children}
          </ol>
        );
      },
      li({ children, index, ordered }) {
        return (
          <li className="flex items-start gap-2.5 px-2.5 py-[5px] rounded-lg list-none transition-colors">
            {ordered ? (
              <span className="shrink-0 min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/15 rounded-md font-mono tracking-[-0.3px] mt-px">
                {`${(index ?? 0) + 1}.`}
              </span>
            ) : (
              <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-linear-to-br from-[#a78bfa] to-[#818cf8] shadow-[0_0_6px_rgba(167,139,250,0.35)]" />
            )}
            <span className="flex-1 leading-[1.6]">{children}</span>
          </li>
        );
      },
      table({ children }) {
        return (
          <TableContext.Provider value={true}>
            <TableBlock>{children}</TableBlock>
          </TableContext.Provider>
        );
      },
      tr({ children }) {
        return <tr className="border-b border-gray-200 dark:border-white/10 last:border-b-0">{children}</tr>;
      },
      td({ children }) {
        return <td className="px-3 py-2 text-left border-r border-gray-200 dark:border-white/10 last:border-r-0">{children}</td>;
      },
      th({ children }) {
        return <th className="px-3 py-2 text-left border-r border-gray-200 dark:border-white/10 last:border-r-0 bg-gray-50 dark:bg-white/5 font-semibold text-purple-700 dark:text-purple-300">{children}</th>;
      },
    }),
    []
  );
}

export default function MarkdownRenderer({ content }) {
  const mdComponents = useMarkdownComponents();
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {content}
    </ReactMarkdown>
  );
}
