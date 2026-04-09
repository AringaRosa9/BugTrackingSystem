import React from 'react';
import { CircleDashed, CheckCircle2, AlertCircle, RefreshCw, PlayCircle, GitMerge } from 'lucide-react';
import { Bug, BugStatus } from '../../types/bug';
import { buildBugTimelineEvents, TimelineEvent } from '../../utils/bugEvidence';

export default function BugTimeline({ bug }: { bug: Bug }) {
  const events = buildBugTimelineEvents(bug);

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'CREATED': return <PlayCircle className="w-5 h-5 text-purple-500" />;
      case 'STATUS_CHANGE': return <CircleDashed className="w-5 h-5 text-blue-500" />;
      case 'VERIFICATION': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'REOPENED': return <RefreshCw className="w-5 h-5 text-red-500" />;
      case 'DEDUPE': return <GitMerge className="w-5 h-5 text-orange-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: BugStatus) => {
    switch (status) {
      case 'NEW': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'TRIAGED': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'FIXED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REOPENED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <CircleDashed className="w-5 h-5 text-indigo-600" />
        生命周期时间线 (Lifecycle Timeline)
      </h3>
      
      <div className="relative border-l border-gray-200 ml-3 space-y-8">
        {events.map((event) => (
          <div key={event.id} className="relative pl-8">
            {/* Timeline Node Icon */}
            <div className="absolute -left-3.5 top-1 bg-white p-1 rounded-full border border-gray-100 shadow-sm">
              {getEventIcon(event.type)}
            </div>
            
            {/* Event Content */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{event.title}</span>
                <span className="text-xs font-mono text-gray-400">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {event.description}
              </p>
              
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  {event.actor}
                </span>
                
                {event.statusSnapshot && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${getStatusColor(event.statusSnapshot)}`}>
                    {event.statusSnapshot}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
