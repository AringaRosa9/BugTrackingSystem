import React from 'react';
import { LineChart, BarChart, PieChart, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line
} from 'recharts';
import { Bug } from '../../types/bug';
import {
  buildInsightsMetrics,
  buildPlatformDistribution,
  buildPlatformRiskSummaries,
  buildRiskNote,
  buildStatusBreakdown,
  buildTrendData,
} from '../../utils/bugInsights';

interface InsightsPageProps {
  bugs: Bug[];
}

export default function InsightsPage({ bugs }: InsightsPageProps) {
  const metrics = buildInsightsMetrics(bugs);
  const platformData = buildPlatformDistribution(bugs);
  const trendData = buildTrendData(bugs);
  const statusData = buildStatusBreakdown(bugs);
  const platformRiskSummaries = buildPlatformRiskSummaries(bugs);
  const riskNote = buildRiskNote(bugs);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <LineChart className="w-6 h-6 text-indigo-600" />
          平台洞察 & 质量大盘 (Insights & Quality Dashboard)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          部门负责人视角：监控 HRO 各底层平台的缺陷存量、解决趋势及高优风险。
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">总缺陷存量</h3>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{metrics.totalBugs}</span>
            <span className="text-sm font-medium text-gray-500 flex items-center">
              当前实时总量
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">P0/P1 风险水位</h3>
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-600">{metrics.highPriorityCount}</span>
            <span className="text-sm font-medium text-gray-500">个高优待办</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">平均修复时长 (MTTR)</h3>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <BarChart className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{metrics.averageResolutionDays}</span>
            <span className="text-sm font-medium text-gray-500">天</span>
            <span className="text-sm font-medium text-gray-500 ml-2">按已解决缺陷近似</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">本周已解决</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">{metrics.resolvedThisWeek}</span>
            <span className="text-sm font-medium text-gray-500">个缺陷</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Platform Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">各平台缺陷分布 (Bug Distribution)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={platformData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="bugs" name="总缺陷数" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="p0" name="P0 致命" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="p1" name="P1 严重" fill="#f97316" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">新增与解决趋势 (7 Days Trend)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="new" name="新增缺陷" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="resolved" name="已解决" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown & HRO Specific */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">当前状态分布 (Status Breakdown)</h3>
            <div className="h-64 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
              {/* Centered Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ left: '-25%' }}>
                <span className="text-2xl font-bold text-gray-900">{bugs.length}</span>
                <span className="text-xs text-gray-500">Total Bugs</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">平台实时风险概览</h3>
            
            <div className="space-y-4">
              {platformRiskSummaries.map((platform, index) => {
                const colorClass = index === 0 ? 'bg-rose-500' : index === 1 ? 'bg-indigo-500' : 'bg-emerald-500';
                return (
                  <div key={platform.platformId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{platform.name}</span>
                      <span className="text-gray-500 font-mono">{platform.bugs} Bugs</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${Math.max(platform.percentage, 8)}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mt-6">
              <h4 className="text-sm font-semibold text-orange-800 flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4" />
                风险提示
              </h4>
              <p className="text-xs text-orange-700 leading-relaxed">
                {riskNote}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
