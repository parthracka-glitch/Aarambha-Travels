import React, { useState } from 'react';
import { Search, Menu, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileModal } from './ProfileModal';

interface TopbarProps {
  onToggleMobileSidebar?: () => void;
}

export function Topbar({ onToggleMobileSidebar }: TopbarProps) {
  const { activeVertical, apiStatus, user } = useAuth();
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
      <header className="bg-white px-3 sm:px-8 py-3.5 flex items-center justify-between gap-3 border-b border-[#EDE2D0] select-none sticky top-0 z-30 shadow-2xs">
        
        {/* Mobile Hamburger & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3 max-w-md w-full">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden w-8 h-8 rounded-lg bg-[#F8EFEA] border border-[#EDE2D0] flex items-center justify-center text-[#2D1F18] hover:text-[#C65A2E] shadow-2xs active:scale-95 shrink-0 transition-colors"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Search Input Bar */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#756B63] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings, tours, cars, leads..."
              className="w-full bg-[#F8EFEA] border border-[#EDE2D0] rounded-lg pl-8 sm:pl-9 pr-4 py-1.5 sm:py-2 text-xs text-[#2D1F18] placeholder-[#756B63] focus:outline-none focus:bg-white focus:border-[#C65A2E] transition-all"
            />
          </div>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Live API Status Pill */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F8EFEA] border border-[#EDE2D0]"
            title={apiStatus === 'online' ? 'Connected to live database' : 'Connecting to backend...'}
          >
            <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
            <span className="text-[#493B34] font-semibold text-[10px]">
              {apiStatus === 'online' ? 'Live API' : 'Connecting...'}
            </span>
          </div>

          {/* Active Scope Pill */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C65A2E] bg-[#C65A2E]/10 border border-[#C65A2E]/30 px-2.5 py-0.5 rounded-full hidden xs:inline-block sm:inline-block">
            {activeVertical === 'all' ? 'All Scope' : activeVertical === 'tours' ? 'Tours' : 'Rental Fleet'}
          </span>

          {/* Notification Dropdown Component */}
          <NotificationDropdown />

          {/* User Profile Avatar with Click Handler */}
          <button
            id="topbar-profile-trigger"
            onClick={() => setIsProfileOpen(true)}
            title="Open Account Profile & Settings"
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-[#F8EFEA] border border-transparent hover:border-[#EDE2D0] transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#2D1F18] text-white flex items-center justify-center font-bold text-xs shadow-2xs group-hover:bg-[#C65A2E] transition-colors">
              {initials}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-bold text-[#2D1F18] leading-tight group-hover:text-[#C65A2E] transition-colors">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-[#756B63] flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5 text-[#C65A2E]" />
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
