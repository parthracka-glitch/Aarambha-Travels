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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#171721]/95 backdrop-blur-md border-t border-[#272735] pb-safe px-2 py-1.5 flex items-center justify-around shadow-lg select-none">
      
      {/* Dashboard */}
      {!isViewer && (
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[56px] ${
              isActive ? 'text-[#5266EB] font-bold scale-105' : 'text-[#AFB2CE] hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </NavLink>
      )}

      {/* Bookings */}
      <NavLink
        to="/bookings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[56px] ${
            isActive ? 'text-[#5266EB] font-bold scale-105' : 'text-[#AFB2CE] hover:text-white'
          }`
        }
      >
        <CalendarCheck className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Bookings</span>
      </NavLink>

      {/* Inventory: Tours or Fleet */}
      {!isViewer && (
        <NavLink
          to={activeVertical === 'fleet' ? '/fleet' : '/tours'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[56px] ${
              isActive ? 'text-[#5266EB] font-bold scale-105' : 'text-[#AFB2CE] hover:text-white'
            }`
          }
        >
          {activeVertical === 'fleet' ? (
            <>
              <Car className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">Fleet</span>
            </>
          ) : (
            <>
              <Compass className="w-5 h-5 mb-0.5" />
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
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[56px] ${
              isActive ? 'text-[#5266EB] font-bold scale-105' : 'text-[#AFB2CE] hover:text-white'
            }`
          }
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Leads</span>
        </NavLink>
      )}

      {/* More / Menu Drawer Trigger */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#AFB2CE] hover:text-white transition-all duration-150 min-w-[56px]"
        aria-label="Open Full Admin Menu"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">More</span>
      </button>

    </nav>
  );
}
