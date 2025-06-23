'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

export default function CodeHighlighter({ 
  code, 
  language = 'javascript', 
  className = '' 
}: CodeHighlighterProps) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border border-gray-200/50 ${className}`}>
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-gray-400 text-sm ml-2 font-mono">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '14px',
          lineHeight: '1.6',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        }}
        wrapLongLines
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
} 