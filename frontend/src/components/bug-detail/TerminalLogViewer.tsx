import React, { useState } from 'react';
import { Terminal, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { Bug } from '../../types/bug';
import { buildBugLogEntries } from '../../utils/bugEvidence';

export default function TerminalLogViewer({ bug }: { bug: Bug }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const logEntries = buildBugLogEntries(bug);

  const handleCopy = async () => {
    const logText = logEntries.map(
      log => `[${log.timestamp}] [${log.level}] [${log.service}] ${log.message}`
    ).join('\n');
    await navigator.clipboard.writeText(logText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-emerald-400';
      case 'WARN': return 'text-amber-400';
      case 'ERROR': return 'text-rose-400';
      case 'DEBUG': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const containerClasses = isFullScreen
    ? 'fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col'
    : 'bg-[#0A0A0A] rounded-xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[400px]';

  return (
    <div className={containerClasses}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-gray-800 select-none">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>system-logs-{bug.bugId.toLowerCase()}.log</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Copy Logs"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed">
        {logEntries.map((log) => (
          <div key={log.id} className="flex gap-3 hover:bg-white/[0.02] px-2 py-0.5 rounded transition-colors group">
            <div className="text-gray-600 select-none shrink-0">
              {log.timestamp.split('T')[1].replace('Z', '')}
            </div>
            <div className={`w-12 shrink-0 font-semibold select-none ${getLevelColor(log.level)}`}>
              {log.level}
            </div>
            <div className="text-gray-500 shrink-0 select-none">
              [{log.service}]
            </div>
            <div className="text-gray-300 whitespace-pre-wrap break-all">
              {log.message}
            </div>
          </div>
        ))}
        <div className="mt-4 flex items-center gap-2 text-gray-500 px-2 animate-pulse">
          <span className="w-2 h-4 bg-gray-500 inline-block"></span>
          Waiting for new logs...
        </div>
      </div>
    </div>
  );
}
