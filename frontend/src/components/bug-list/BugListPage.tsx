import React, { useState, useMemo } from 'react';
import { Bug } from '../../types/bug';
import FilterBar from './FilterBar';
import DataTable from './DataTable';
import { ListFilter } from 'lucide-react';

interface BugListPageProps {
  bugs: Bug[];
  onSelectBug: (bug: Bug) => void;
}

export default function BugListPage({ bugs, onSelectBug }: BugListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const filteredBugs = useMemo(() => {
    return bugs.filter(bug => {
      const matchSearch = 
        bug.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        bug.bugId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPlatform = selectedPlatform === 'All' || bug.platformId === selectedPlatform;
      const matchStatus = selectedStatus === 'All' || bug.status === selectedStatus;
      const matchPriority = selectedPriority === 'All' || bug.priority === selectedPriority;
      
      return matchSearch && matchPlatform && matchStatus && matchPriority;
    });
  }, [bugs, searchTerm, selectedPlatform, selectedStatus, selectedPriority]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-indigo-600" />
            所有缺陷 (All Bugs)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            统一管理来自 HRO 各底层平台的缺陷工单
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
            共 <span className="text-indigo-600 font-bold">{filteredBugs.length}</span> 个缺陷
          </span>
        </div>
      </div>

      <FilterBar 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform}
        selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority} setSelectedPriority={setSelectedPriority}
      />

      <DataTable bugs={filteredBugs} onRowClick={onSelectBug} />
    </div>
  );
}
