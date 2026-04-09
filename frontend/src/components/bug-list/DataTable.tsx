import React from 'react';
import { Bug } from '../../types/bug';
import { Clock, User } from 'lucide-react';

interface DataTableProps {
  bugs: Bug[];
  onRowClick: (bug: Bug) => void;
}

export default function DataTable({ bugs, onRowClick }: DataTableProps) {
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
      case 'VERIFIED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (bugs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
        <p className="text-gray-500 font-medium">没有找到符合条件的缺陷。</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Bug ID</th>
              <th scope="col" className="px-4 py-3 font-semibold tracking-wider w-1/3">标题 (Title)</th>
              <th scope="col" className="px-4 py-3 font-semibold tracking-wider">优先级</th>
              <th scope="col" className="px-4 py-3 font-semibold tracking-wider">状态</th>
              <th scope="col" className="px-4 py-3 font-semibold tracking-wider">来源平台</th>
              <th scope="col" className="px-4 py-3 font-semibold tracking-wider">责任人</th>
              <th scope="col" className="px-4 py-3 font-semibold tracking-wider text-right">更新时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bugs.map((bug) => (
              <tr 
                key={bug.bugId} 
                onClick={() => onRowClick(bug)}
                className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-500 group-hover:text-indigo-600 transition-colors">
                  {bug.bugId}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-xs" title={bug.title}>
                  {bug.title}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getPriorityColor(bug.priority)}`}>
                    {bug.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(bug.status)}`}>
                    {bug.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {bug.platformId}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className={bug.assignee ? 'text-gray-700' : 'text-gray-400 italic'}>
                      {bug.assignee || '未分配'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-xs text-gray-500 tabular-nums">
                  <div className="flex items-center justify-end gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(bug.updatedAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer (Mock) */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <span>显示 1 到 {bugs.length} 条，共 {bugs.length} 条记录</span>
        <div className="flex gap-1">
          <button className="px-2 py-1 border border-gray-200 rounded bg-white text-gray-400 cursor-not-allowed">上一页</button>
          <button className="px-2 py-1 border border-gray-200 rounded bg-white hover:bg-gray-100 text-gray-700 transition-colors">下一页</button>
        </div>
      </div>
    </div>
  );
}
