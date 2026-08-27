import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TopbarProps {
  onToggleMobileSidebar?: () => void;
}

export function Topbar({ onToggleMobileSidebar }: TopbarProps) {
  const { activeVertical, apiStatus, user } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-[#FAFAFC] px-3 sm:px-8 py-3 sm:py-5 flex items-center justify-between gap-2.5 border-b border-gray-100 select-none">
      
      {/* Mobile Hamburger & Search Input Bar */}
      <div className="flex items-center gap-2 sm:gap-3 max-w-md w-full">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden w-8 h-8 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 shadow-sm active:scale-95 shrink-0"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search Input Bar (Ai AETHER Style) */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search CRM..."
            className="w-full bg-white border border-gray-200/80 rounded-full pl-8 sm:pl-10 pr-4 sm:pr-12 py-1.5 sm:py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-500 shadow-sm transition-all"
            readOnly
          />
          <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            ⌘F
          </span>
        </div>
      </div>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Live Status Pill */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white border border-gray-200/80 shadow-2xs"
          title={apiStatus === 'online' ? 'Connected to live database' : 'Syncing / Reconnecting to backend'}
        >
          <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
          <span className="text-gray-600 font-semibold text-[10px]">
            {apiStatus === 'online' ? 'Live' : 'Connecting...'}
          </span>
        </div>

        {/* Active Scope Pill on Mobile */}
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5266EB] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full hidden xs:inline-block sm:inline-block">
          {activeVertical === 'all' ? 'All' : activeVertical === 'tours' ? 'Tours' : 'Rental'}
        </span>

        {/* Circular Notification Bell */}
        <button className="w-8 h-8 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-black shadow-sm transition-all relative shrink-0">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600" />
        </button>

        {/* User Profile Avatar with Border */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-sm cursor-pointer active:scale-95 transition-transform shrink-0">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-[10px] sm:text-xs text-indigo-700">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
          </div>
        </div>

      </div>

    </header>
  );
}
