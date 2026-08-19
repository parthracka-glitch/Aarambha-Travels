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
    <header className="bg-[#FAFAFC] px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3 border-b border-gray-100">
      
      {/* Mobile Hamburger & Search Input Bar */}
      <div className="flex items-center gap-3 max-w-md w-full">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden w-9 h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 shadow-sm hover:bg-gray-100"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search Input Bar (Ai AETHER Style) */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search or type a command"
            className="w-full bg-white border border-gray-200/80 rounded-full pl-10 pr-10 sm:pr-12 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-500 shadow-sm transition-all"
            readOnly
          />
          <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            ⌘F
          </span>
        </div>
      </div>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center gap-2 sm:gap-3">
        


        {/* Circular Notification Bell */}
        <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-black hover:scale-105 shadow-sm transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
        </button>

        {/* User Profile Avatar with Border */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-sm cursor-pointer hover:scale-105 transition-transform flex-shrink-0">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-xs text-indigo-700">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD'}
          </div>
        </div>

      </div>

    </header>
  );
}
