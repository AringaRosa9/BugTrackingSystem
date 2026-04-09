import React from 'react';
import { AlertCircle, Clock, Activity, ArrowRight } from 'lucide-react';
import { Bug } from '../../types/bug';
import { buildDashboardMetrics, getDashboardRecentBugs } from '../../utils/bugMetrics';

interface DashboardPageProps {
  bugs: Bug[];
  onSelectBug: (bug: Bug) => void;
  onViewAll: () => void;
}

export default function DashboardPage({ bugs, onSelectBug, onViewAll }: DashboardPageProps) {
  const metrics = buildDashboardMetrics(bugs, 'dev_john');

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
      case 'NEW': return 'bg-purple-100 text-purple-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'TRIAGED': return 'bg-indigo-100 text-indigo-700';
      case 'FIXED': return 'bg-green-100 text-green-700';
      case 'VERIFIED': return 'bg-emerald-100 text-emerald-700';
      case 'CLOSED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const recentBugs = getDashboardRecentBugs(bugs);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">我的待处理</p>
            <h2 className="text-3xl font-bold tracking-tight">{metrics.myOpenCount}</h2>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">P0 / P1 (部门级)</p>
            <h2 className="text-3xl font-bold tracking-tight text-red-600">{metrics.highPriorityCount}</h2>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">今日新增 (全平台)</p>
            <h2 className="text-3xl font-bold tracking-tight">{metrics.todayNewCount}</h2>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Recent Bugs List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">最近 24 小时 & 高优待办</h3>
          <button 
            onClick={onViewAll}
            className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1"
          >
            查看全部 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentBugs.map((bug) => (
            <div 
              key={bug.bugId} 
              className="p-6 hover:bg-gray-50 transition-colors group cursor-pointer"
              onClick={() => onSelectBug(bug)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-500">{bug.bugId}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(bug.priority)}`}>
                      {bug.priority}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bug.status)}`}>
                      {bug.status}
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {bug.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      {bug.platformId}
                    </span>
                    <span>•</span>
                    <span>处理人: {bug.assignee || '未分配'}</span>
                    <span>•</span>
                    <span>{new Date(bug.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBug(bug);
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 shadow-sm"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
