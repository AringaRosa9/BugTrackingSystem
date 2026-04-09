import React, { useState } from 'react';
import { Flame, ChevronDown, ChevronUp, GitMerge, ExternalLink } from 'lucide-react';
import { Bug } from '../../types/bug';

function buildSiblingBugId(sourceId: string, offset: number) {
  const parts = sourceId.split('-');
  const numericSuffix = Number.parseInt(parts[parts.length - 1] || '', 10);
  if (Number.isNaN(numericSuffix)) {
    return `${sourceId}-similar-${offset}`;
  }

  const width = parts[parts.length - 1].length;
  parts[parts.length - 1] = String(Math.max(0, numericSuffix - offset)).padStart(width, '0');
  return parts.join('-');
}

// Hook to simulate deduplication logic
export function useDedupeLogic(bug: Bug) {
  // In a real system, this would fetch from an API based on dedupeKey or errorSignature
  const [similarBugs, setSimilarBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSimilarBugs = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock similar bugs based on dedupeKey or platform
    setSimilarBugs([
      {
        ...bug,
        bugId: buildSiblingBugId(bug.bugId, 1),
        status: 'CLOSED',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        title: `[Duplicate] ${bug.title}`,
      },
      {
        ...bug,
        bugId: buildSiblingBugId(bug.bugId, 5),
        status: 'FIXED',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        title: `[Similar] ${bug.title} (Previous Version)`,
      }
    ]);
    setIsLoading(false);
  };

  return {
    similarBugs,
    isLoading,
    fetchSimilarBugs,
    duplicateCount: bug.duplicateCount || 1,
    dedupeKey: bug.dedupeKey || `hash_${bug.platformId}_${bug.sourceEntityId}`
  };
}

export default function DedupeBadge({ bug }: { bug: Bug }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { similarBugs, isLoading, fetchSimilarBugs, duplicateCount, dedupeKey } = useDedupeLogic(bug);

  const handleToggle = () => {
    if (!isExpanded && similarBugs.length === 0) {
      fetchSimilarBugs();
    }
    setIsExpanded(!isExpanded);
  };

  if (duplicateCount <= 1) return null;

  return (
    <div className="relative inline-block mt-2 w-full max-w-2xl">
      <button 
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 rounded-md text-xs font-medium transition-colors"
      >
        <Flame className="w-3.5 h-3.5" />
        重复触发 x{duplicateCount}
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
      </button>

      {isExpanded && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <GitMerge className="w-3.5 h-3.5 text-gray-500" />
              智能去重分析 (Deduplication Analysis)
            </span>
            <span className="text-[10px] font-mono text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
              Key: {dedupeKey}
            </span>
          </div>
          
          <div className="p-2 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-gray-400">
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                <span className="text-xs">分析相似问题中...</span>
              </div>
            ) : (
              <ul className="space-y-1">
                {similarBugs.map(sb => (
                  <li key={sb.bugId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-500 w-16">{sb.bugId}</span>
                      <span className="text-xs text-gray-700 font-medium truncate max-w-[200px] sm:max-w-xs">
                        {sb.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${sb.status === 'CLOSED' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                        {sb.status}
                      </span>
                      <button className="text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
