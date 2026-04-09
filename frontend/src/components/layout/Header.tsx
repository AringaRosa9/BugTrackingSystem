import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Global Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search bugs, platforms, or users..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-200 mx-2"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">dev_john</span>
            <span className="text-xs text-gray-500">Frontend Engineer</span>
          </div>
          <div className="w-9 h-9 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full flex items-center justify-center font-semibold shadow-sm group-hover:bg-indigo-200 transition-colors">
            J
          </div>
        </div>
      </div>
    </header>
  );
}
