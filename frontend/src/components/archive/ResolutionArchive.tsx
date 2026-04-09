import React from 'react';
import { Package, CheckCircle2, User, GitCommit, Calendar, Activity } from 'lucide-react';
import { Bug } from '../../types/bug';
import { buildArchiveGroups } from '../../utils/bugInsights';

interface ResolutionArchiveProps {
  bugs: Bug[];
}

export default function ResolutionArchive({ bugs }: ResolutionArchiveProps) {
  const archiveGroups = buildArchiveGroups(bugs);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'FIXED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-500/30 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3 flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" />
            修复归档与发布日志 (Resolution Archive)
          </h1>
          <p className="text-gray-500 text-lg">
            回顾团队在各个版本中修复的缺陷与系统稳定性提升。
          </p>
        </div>

        {/* Archive List */}
        <div className="space-y-12">
          {archiveGroups.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center text-gray-500">
              当前还没有进入修复归档的缺陷。
            </div>
          )}

          {archiveGroups.map((release) => (
            <section key={release.version} className="relative">
              {/* Release Header */}
              <div className="flex items-center gap-4 mb-6 sticky top-0 bg-gray-50/95 backdrop-blur py-4 z-10">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 shrink-0">
                  <GitCommit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{release.version}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4" />
                    {release.date}
                    <span className="mx-2 text-gray-300">•</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {release.bugs.length} Issues Resolved
                  </div>
                </div>
              </div>

              {/* Bugs List */}
              <div className="ml-5 pl-8 border-l-2 border-gray-200 space-y-6">
                {release.bugs.map((bug) => (
                  <div key={bug.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                    
                    {/* Bug Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-gray-500">{bug.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bug.status)}`}>
                            {bug.status}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            <Activity className="w-3.5 h-3.5" />
                            {bug.platform}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bug.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <User className="w-4 h-4 text-indigo-500" />
                        {bug.assignee}
                      </div>
                    </div>

                    {/* Resolution Summary */}
                    <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100/50">
                      <h4 className="text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-2">
                        修复摘要 (Resolution Summary)
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {bug.summary}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

      </div>
    </div>
  );
}
