import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Car, Compass, Users, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const { activeVertical, user } = useAuth();
  const isViewer = user?.role === 'viewer';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/90 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] px-2 pt-1 flex items-center justify-around shadow-lg select-none">
      
      {/* Dashboard */}
      {!isViewer && (
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[54px] min-h-[44px] tap-highlight-transparent touch-manipulation active:scale-95 ${
              isActive
                ? 'text-amber-800 font-bold bg-amber-50/90 border border-amber-200/60 shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <LayoutDashboard className="w-4.5 h-4.5 mb-0.5 text-current" />
          <span className="text-[10px] tracking-tight">Home</span>
        </NavLink>
      )}

      {/* Bookings */}
      <NavLink
        to="/bookings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[54px] min-h-[44px] tap-highlight-transparent touch-manipulation active:scale-95 ${
            isActive
              ? 'text-amber-800 font-bold bg-amber-50/90 border border-amber-200/60 shadow-2xs'
              : 'text-gray-500 hover:text-gray-900'
          }`
        }
      >
        <CalendarCheck className="w-4.5 h-4.5 mb-0.5 text-current" />
        <span className="text-[10px] tracking-tight">Bookings</span>
      </NavLink>

      {/* Inventory: Tours or Fleet */}
      {!isViewer && (
        <NavLink
          to={activeVertical === 'fleet' ? '/fleet' : '/tours'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[54px] min-h-[44px] tap-highlight-transparent touch-manipulation active:scale-95 ${
              isActive
                ? 'text-amber-800 font-bold bg-amber-50/90 border border-amber-200/60 shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          {activeVertical === 'fleet' ? (
            <>
              <Car className="w-4.5 h-4.5 mb-0.5 text-current" />
              <span className="text-[10px] tracking-tight">Fleet</span>
            </>
          ) : (
            <>
              <Compass className="w-4.5 h-4.5 mb-0.5 text-current" />
              <span className="text-[10px] tracking-tight">Tours</span>
            </>
          )}
        </NavLink>
      )}

      {/* Leads & Inquiries */}
      {!isViewer && (
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[54px] min-h-[44px] tap-highlight-transparent touch-manipulation active:scale-95 ${
              isActive
                ? 'text-amber-800 font-bold bg-amber-50/90 border border-amber-200/60 shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <Users className="w-4.5 h-4.5 mb-0.5 text-current" />
          <span className="text-[10px] tracking-tight">Leads</span>
        </NavLink>
      )}

      {/* More / Menu Drawer Trigger */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-gray-500 hover:text-gray-900 transition-all duration-150 min-w-[54px] min-h-[44px] tap-highlight-transparent touch-manipulation active:scale-95 cursor-pointer"
        aria-label="Open Full Navigation Menu"
      >
        <Menu className="w-4.5 h-4.5 mb-0.5 text-current" />
        <span className="text-[10px] tracking-tight">More</span>
      </button>

    </nav>
  );
}
