import React, { useState } from 'react';
import { Bug } from '../../types/bug';
import { ArrowLeft, Clock, User, ExternalLink, Info, Activity, Terminal } from 'lucide-react';
import PlatformContextViewer from './PlatformContextViewer';
import ActionPanel from './ActionPanel';
import DedupeBadge from './DedupeBadge';
import BugTimeline from './BugTimeline';
import VerificationModal from './VerificationModal';
import TerminalLogViewer from './TerminalLogViewer';

interface BugDetailPageProps {
  bug: Bug;
  onBack: () => void;
  onUpdateBug: (updatedBug: Bug) => void;
}

export default function BugDetailPage({ bug, onBack, onUpdateBug }: BugDetailPageProps) {
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const handleStatusUpdate = (newStatus: Bug['status']) => {
    onUpdateBug({ ...bug, status: newStatus });
  };

  const handleClaim = () => {
    onUpdateBug({ ...bug, assignee: 'dev_john', status: 'IN_PROGRESS' });
  };

  const handleVerifySuccess = () => {
    handleStatusUpdate('VERIFIED');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-100 text-red-700 border-red-200';
      case 'P1': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'P2': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
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
    <div className="bg-gray-50 text-gray-900 font-sans selection:bg-indigo-500/30">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Navigation & Status */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回列表 (Back)
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-500">{bug.bugId}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(bug.priority)}`}>
              {bug.priority}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bug.status)}`}>
              {bug.status}
            </span>
          </div>
        </div>

        {/* Title & Meta Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            {bug.title}
          </h1>
          <DedupeBadge bug={bug} />
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mt-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              创建于 {new Date(bug.createdAt).toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" />
              报告人: <span className="text-gray-700">{bug.reporter}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-gray-400" />
              处理人: <span className="text-indigo-600">{bug.assignee || '未分配'}</span>
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Description & Platform Context */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                问题描述 (Description)
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {bug.description || '暂无详细描述。'}
                </p>
              </div>
            </section>

            {/* Dynamic Platform Context Viewer */}
            <PlatformContextViewer bug={bug} />

            {/* Terminal Log Viewer */}
            <section className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                调试证据区 (System Logs)
              </h3>
              <TerminalLogViewer bug={bug} />
            </section>

          </div>

          {/* Right Column: Actions, Metadata & Timeline */}
          <div className="space-y-8">
            
            {/* Action Panel */}
            <ActionPanel 
              bug={bug} 
              onUpdateStatus={handleStatusUpdate}
              onClaim={handleClaim}
              onVerifyClick={() => setIsVerifyModalOpen(true)}
            />

            {/* Metadata Panel */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                基础信息 (Metadata)
              </h3>
              
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">所属平台</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {bug.platformId}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">来源对象类型</p>
                <p className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block text-sm">
                  {bug.sourceEntityType}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">来源对象 ID</p>
                <p className="font-mono text-sm text-gray-700">{bug.sourceEntityId}</p>
              </div>

              {bug.sourceUrl && (
                <div className="pt-4 border-t border-gray-100">
                  <a href={bug.sourceUrl} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1.5 transition-colors">
                    跳转至原平台 <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Bug Timeline */}
            <BugTimeline bug={bug} />

          </div>
        </div>
      </main>

      {/* Verification Modal */}
      <VerificationModal 
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        bug={bug}
        onVerify={handleVerifySuccess}
      />
    </div>
  );
}
