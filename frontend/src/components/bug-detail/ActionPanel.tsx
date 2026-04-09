import React from 'react';
import { Bug } from '../../types/bug';
import { PlayCircle, CheckCircle, UserPlus, Tag, ShieldAlert } from 'lucide-react';

interface ActionPanelProps {
  bug: Bug;
  onUpdateStatus: (newStatus: Bug['status']) => void;
  onClaim: () => void;
  onVerifyClick?: () => void;
}

export default function ActionPanel({ bug, onUpdateStatus, onClaim, onVerifyClick }: ActionPanelProps) {
  
  const renderVerificationMode = () => {
    if (!bug.verificationMode || bug.verificationMode === 'not_applicable') return null;
    
    const modeLabels: Record<string, string> = {
      'platform_auto_test': '平台自动化测试',
      'manual_verify': '人工验证',
      'regression_suite': '回归测试套件',
      'smoke_test': '冒烟测试'
    };

    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">验证策略 (Verification Mode)</p>
        <p className="text-sm font-medium text-indigo-700 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          {modeLabels[bug.verificationMode] || bug.verificationMode}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
        状态流转 (Actions)
      </h3>

      <div className="space-y-3">
        {/* Claim Action */}
        {(!bug.assignee || bug.status === 'NEW') && (
          <button 
            onClick={onClaim}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            认领 (Claim)
          </button>
        )}

        {/* Triage Action */}
        {bug.status === 'NEW' && (
          <button 
            onClick={() => onUpdateStatus('TRIAGED')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Tag className="w-4 h-4" />
            完成分诊 (Triage)
          </button>
        )}

        {/* Start Progress Action */}
        {bug.status === 'TRIAGED' && (
          <button 
            onClick={() => onUpdateStatus('IN_PROGRESS')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            开始处理 (Start Progress)
          </button>
        )}

        {/* Mark Fixed Action */}
        {bug.status === 'IN_PROGRESS' && (
          <button 
            onClick={() => onUpdateStatus('FIXED')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            标记为已修复 (Mark as Fixed)
          </button>
        )}

        {/* Verify Action */}
        {bug.status === 'FIXED' && (
          <button 
            onClick={() => {
              if (onVerifyClick) {
                onVerifyClick();
              } else {
                onUpdateStatus('VERIFIED');
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            发起验证 (Verify)
          </button>
        )}

        {/* Close Action */}
        {bug.status === 'VERIFIED' && (
          <button 
            onClick={() => onUpdateStatus('CLOSED')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            关闭缺陷 (Close)
          </button>
        )}
      </div>

      {renderVerificationMode()}
    </div>
  );
}
