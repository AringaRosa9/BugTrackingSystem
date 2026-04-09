import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Loader2, PlayCircle, ShieldCheck, Database, FileCode2 } from 'lucide-react';
import { Bug } from '../../types/bug';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bug: Bug;
  onVerify: () => void;
}

export default function VerificationModal({ isOpen, onClose, bug, onVerify }: VerificationModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVerifying(false);
      setVerificationResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getVerificationOptions = (platformId: string) => {
    switch (platformId) {
      case 'action_editor':
        return {
          title: '执行 Action 冒烟测试 (Action Smoke Test)',
          icon: <PlayCircle className="w-5 h-5 text-blue-500" />,
          description: '触发 Action Editor 内部的冒烟测试套件，验证 Payload 是否符合 Schema 规范。'
        };
      case 'data_object_editor':
        return {
          title: '重新运行 Schema 校验 (Rerun Schema Validation)',
          icon: <Database className="w-5 h-5 text-purple-500" />,
          description: '针对已修复的 Data Object，重新执行全量 Schema 完整性与兼容性校验。'
        };
      case 'rule_editor':
        return {
          title: '触发 Rule 单元测试 (Trigger Rule Unit Test)',
          icon: <FileCode2 className="w-5 h-5 text-orange-500" />,
          description: '运行该 Rule 绑定的所有单元测试用例，确保逻辑分支覆盖率和正确性。'
        };
      default:
        return {
          title: '执行通用回归测试 (Execute General Regression Test)',
          icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
          description: '触发 Ontology Test System 的通用回归测试链路，验证整体连通性。'
        };
    }
  };

  const options = getVerificationOptions(bug.platformId);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock success (in reality, this might fail and set status to REOPENED)
    setVerificationResult('success');
    
    // Wait a moment to show success state before closing
    setTimeout(() => {
      setIsVerifying(false);
      onVerify();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            发起验证闭环 (Verification Loop)
          </h2>
          <button 
            onClick={onClose}
            disabled={isVerifying}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">
                {options.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{options.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {options.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">验证目标 (Target)</h4>
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
              <span className="text-sm font-mono text-gray-600">{bug.bugId}</span>
              <span className="text-sm text-gray-900 font-medium truncate max-w-[250px]">{bug.title}</span>
            </div>
          </div>

          {/* Status/Loading Indicator */}
          {isVerifying && (
            <div className="flex flex-col items-center justify-center py-4 space-y-3 animate-in fade-in">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm text-indigo-600 font-medium">正在向 {bug.platformId} 发送验证指令...</p>
            </div>
          )}

          {verificationResult === 'success' && (
            <div className="flex flex-col items-center justify-center py-4 space-y-3 animate-in zoom-in">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-green-700 font-medium">验证通过！状态将更新为 VERIFIED</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isVerifying}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            取消 (Cancel)
          </button>
          <button 
            onClick={handleVerify}
            disabled={isVerifying || verificationResult !== null}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                验证中...
              </>
            ) : (
              '确认执行 (Execute)'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
