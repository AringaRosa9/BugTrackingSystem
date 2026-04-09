import React from 'react';
import { LayoutDashboard, Bug, LineChart, Settings, BugPlay, ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed, currentView, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: '工作台 (Dashboard)', icon: LayoutDashboard },
    { id: 'all_bugs', label: '所有缺陷 (All Bugs)', icon: Bug },
    { id: 'archive', label: '修复归档 (Archive)', icon: Package },
    { id: 'insights', label: '平台洞察 (Insights)', icon: LineChart },
    { id: 'settings', label: '系统配置 (Settings)', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200 overflow-hidden shrink-0">
        <BugPlay className="w-8 h-8 text-indigo-600 shrink-0" />
        {!isCollapsed && (
          <span className="ml-3 font-bold text-gray-900 whitespace-nowrap tracking-tight">
            Bug Tracking System
          </span>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm z-10"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {!isCollapsed && (
                <span className={`ml-3 text-sm font-medium whitespace-nowrap ${isActive ? 'text-indigo-700' : ''}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
