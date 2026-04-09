import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
}

export default function FilterBar({
  searchTerm, setSearchTerm,
  selectedPlatform, setSelectedPlatform,
  selectedStatus, setSelectedStatus,
  selectedPriority, setSelectedPriority
}: FilterBarProps) {
  
  const platforms = ['All', 'ontology_test_system', 'rule_editor', 'data_object_editor', 'event_editor', 'action_editor', 'link_generator'];
  const statuses = ['All', 'NEW', 'IN_PROGRESS', 'TRIAGED', 'FIXED', 'VERIFIED', 'CLOSED'];
  const priorities = ['All', 'P0', 'P1', 'P2', 'P3'];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="搜索 Bug ID 或标题..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">筛选:</span>
        </div>

        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer shrink-0"
        >
          <option value="All">所有平台</option>
          {platforms.slice(1).map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer shrink-0"
        >
          <option value="All">所有状态</option>
          {statuses.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer shrink-0"
        >
          <option value="All">所有优先级</option>
          {priorities.slice(1).map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0 border border-transparent hover:border-indigo-200 ml-1">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
