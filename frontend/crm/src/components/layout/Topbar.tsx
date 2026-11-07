import React, { useState } from 'react';
import { Search, Menu, ChevronDown } from 'lucide-react';
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
    : 'AS';

  return (
    <>
      <header className="bg-white px-3 sm:px-6 py-2.5 pt-[max(0.6rem,env(safe-area-inset-top,0px))] flex items-center justify-between gap-3 border-b border-[#E8ECF4] shadow-xs select-none sticky top-0 z-30">
        
        {/* Mobile Hamburger & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3 max-w-lg w-full">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-[#F5F7FC] border border-[#E8ECF4] flex items-center justify-center text-[#17233D] hover:bg-[#EDF3FF] active:scale-95 shrink-0 transition-colors cursor-pointer tap-highlight-transparent touch-manipulation"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          {/* Search Input Bar (Matches Reference Design) */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#77839A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings, tours, customers... ⌘K"
              className="w-full bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl pl-10 pr-3 sm:pr-12 py-2 text-xs text-[#17233D] placeholder-[#77839A] focus:outline-none focus:bg-white focus:border-[#3569F6] focus:ring-2 focus:ring-[#3569F6]/10 transition-all font-medium"
            />
            <kbd className="hidden sm:inline-flex items-center absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-[#77839A] bg-white border border-[#E8ECF4] rounded-md shadow-2xs pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Live System Status Pill */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#12A879] bg-[#E7F7F2] border border-[#BDEBDC]"
            title={apiStatus === 'online' ? 'Live system status' : 'Connecting to backend...'}
          >
            <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-[#12A879]' : 'bg-amber-500 animate-ping'}`} />
            <span>Live</span>
          </div>

          {/* Active Scope Switcher Pill */}
          <button
            onClick={() => {
              const next = activeVertical === 'all' ? 'tours' : activeVertical === 'tours' ? 'fleet' : 'all';
              setActiveVertical(next);
            }}
            title="Click to toggle scope: All / Tours / Rental Fleet"
            className="text-xs font-semibold text-[#17233D] bg-[#F5F7FC] hover:bg-[#EDF3FF] border border-[#E8ECF4] px-3 py-1 rounded-xl hidden sm:inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="text-[#77839A] font-normal">Scope:</span>
            <span className="capitalize text-[#3569F6] font-bold">{activeVertical === 'all' ? 'All' : activeVertical}</span>
          </button>

          {/* Notification Dropdown Component */}
          <NotificationDropdown />

          {/* User Profile Avatar with Click Handler (Matches Reference Design) */}
          <button
            id="topbar-profile-trigger"
            onClick={() => setIsProfileOpen(true)}
            title="Open Account Profile & Settings"
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F5F7FC] transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#1C315A] text-white border border-[#2B4374] flex items-center justify-center font-bold text-xs group-hover:bg-[#3569F6] transition-colors shadow-xs">
              {initials}
            </div>
            <div className="hidden lg:block text-left pr-1 leading-tight">
              <p className="text-xs font-bold text-[#17233D]">
                {user?.name || 'Aarambha Super Admin'}
              </p>
              <p className="text-[10px] text-[#77839A] capitalize font-medium">
                {user?.role === 'viewer' ? 'Viewer' : 'Super Admin'}
              </p>
            </div>
            <ChevronDown className="hidden lg:block w-3.5 h-3.5 text-[#77839A] group-hover:text-[#17233D] transition-colors" />
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
