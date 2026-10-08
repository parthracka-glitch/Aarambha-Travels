import React, { useState } from 'react';
import { Search, Menu, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileModal } from './ProfileModal';

interface TopbarProps {
  onToggleMobileSidebar?: () => void;
}

export function Topbar({ onToggleMobileSidebar }: TopbarProps) {
  const { activeVertical, setActiveVertical, apiStatus, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AD';

  return (
    <>
      <header className="bg-white px-3 sm:px-6 py-2 sm:py-2.5 pt-[max(0.5rem,env(safe-area-inset-top,0px))] flex items-center justify-between gap-2 sm:gap-3 border-b border-gray-200/90 shadow-2xs select-none sticky top-0 z-30">
        
        {/* Mobile Hamburger & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3 max-w-md w-full">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden w-9 h-9 min-w-[36px] min-h-[36px] rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:scale-95 shrink-0 transition-colors cursor-pointer tap-highlight-transparent touch-manipulation"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          {/* Search Input Bar */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings, fleet, tours..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 sm:pr-11 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
            />
            <kbd className="hidden sm:inline-flex items-center absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded shadow-2xs pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Live API Status Pill */}
          <div 
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70"
            title={apiStatus === 'online' ? 'Connected to live database' : 'Connecting to backend...'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
            <span className="hidden xs:inline">
              {apiStatus === 'online' ? 'Live API' : 'Connecting...'}
            </span>
            <span className="xs:hidden">
              {apiStatus === 'online' ? 'Live' : '...'}
            </span>
          </div>

          {/* Active Scope Switcher Pill */}
          <button
            onClick={() => {
              const next = activeVertical === 'all' ? 'tours' : activeVertical === 'tours' ? 'fleet' : 'all';
              setActiveVertical(next);
            }}
            title="Click to toggle scope: All / Tours / Rental Fleet"
            className="text-[11px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200/70 border border-gray-200/80 px-2 py-0.5 rounded-md hidden xs:inline-flex sm:inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="text-gray-400">Scope:</span>
            <span className="font-semibold text-gray-900 capitalize">{activeVertical === 'all' ? 'All' : activeVertical}</span>
          </button>

          {/* Notification Dropdown Component */}
          <NotificationDropdown />

          {/* User Profile Avatar with Click Handler */}
          <button
            id="topbar-profile-trigger"
            onClick={() => setIsProfileOpen(true)}
            title="Open Account Profile & Settings"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 border border-gray-200/60 flex items-center justify-center font-semibold text-xs group-hover:bg-gray-200 transition-colors">
              {initials}
            </div>
            <div className="hidden lg:block text-left pr-1 leading-tight">
              <p className="text-xs font-medium text-gray-900">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-gray-400 flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5 text-gray-400" />
                <span className="capitalize">{user?.role === 'viewer' ? 'Viewer' : 'Super Admin'}</span>
              </p>
            </div>
          </button>

        </div>

      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
