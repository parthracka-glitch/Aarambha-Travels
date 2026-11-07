import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Car, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const { user } = useAuth();
  const isViewer = user?.role === 'viewer';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E8ECF4] pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] px-3 pt-1.5 flex items-center justify-around shadow-lg select-none">
      
      {/* Home / Dashboard */}
      {!isViewer && (
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 min-w-[56px] min-h-[44px] tap-highlight-transparent touch-manipulation active:scale-95 ${
              isActive
                ? 'text-[#3569F6] font-bold'
                : 'text-[#77839A] hover:text-[#17233D]'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5 text-current" />
          <span className="text-[10px] tracking-tight">Home</span>
        </NavLink>
      )}

      {/* Bookings */}
      <NavLink
        to="/bookings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 min-w-[56px] min-h-[44px] tap-highlight-transparent touch-manipulation active:scale-95 ${
            isActive
              ? 'text-[#3569F6] font-bold'
              : 'text-[#77839A] hover:text-[#17233D]'
          }`
        }
      >
        <CalendarCheck className="w-5 h-5 mb-0.5 text-current" />
        <span className="text-[10px] tracking-tight">Bookings</span>
      </NavLink>

      {/* Fleet */}
      {!isViewer && (
        <NavLink
          to="/fleet"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 min-w-[56px] min-h-[44px] tap-highlight-transparent touch-manipulation active:scale-95 ${
              isActive
                ? 'text-[#3569F6] font-bold'
                : 'text-[#77839A] hover:text-[#17233D]'
            }`
          }
        >
          <Car className="w-5 h-5 mb-0.5 text-current" />
          <span className="text-[10px] tracking-tight">Fleet</span>
        </NavLink>
      )}

      {/* More / Menu Drawer Trigger */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[#77839A] hover:text-[#17233D] transition-all duration-150 min-w-[56px] min-h-[44px] tap-highlight-transparent touch-manipulation active:scale-95 cursor-pointer"
        aria-label="Open Full Navigation Menu"
      >
        <Menu className="w-5 h-5 mb-0.5 text-current" />
        <span className="text-[10px] tracking-tight">More</span>
      </button>

    </nav>
  );
}
