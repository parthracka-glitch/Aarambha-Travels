import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Calendar as CalendarIcon, Compass, Car, Users, UserCheck,
  CreditCard, Megaphone, BarChart3, Settings as SettingsIcon,
  LogOut, X, Eye, ArrowRight, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileModal } from './ProfileModal';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const isViewer = user?.role === 'viewer';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const operationsNav = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, superAdminOnly: true },
    { path: '/bookings', label: 'Bookings', icon: CalendarCheck, superAdminOnly: false },
    { path: '/calendar', label: 'Calendar Schedule', icon: CalendarIcon, superAdminOnly: false },
    { path: '/tours', label: 'Tours & Packages', icon: Compass, superAdminOnly: true },
    { path: '/fleet', label: 'Vehicle Fleet', icon: Car, superAdminOnly: true },
    { path: '/customers', label: 'Inquiries & Leads', icon: Users, superAdminOnly: true },
  ];

  const adminNav = [
    { path: '/finance', label: 'Finance & Coupons', icon: CreditCard },
    { path: '/staff', label: 'Staff & Team Access', icon: UserCheck },
    { path: '/marketing', label: 'CMS & Content', icon: Megaphone },
    { path: '/analytics', label: 'Audit Logs & Security', icon: BarChart3 },
    { path: '/settings', label: 'System Settings', icon: SettingsIcon },
  ];

  const visibleOperations = operationsNav.filter((item) => {
    if (isViewer && item.superAdminOnly) return false;
    return true;
  });

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
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-72 sm:w-64 bg-[#101F40] text-white flex flex-col justify-between flex-shrink-0 border-r border-[#1C315A] shadow-2xl md:shadow-none py-4 px-3 select-none transition-transform duration-300 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(0.75rem,env(safe-area-inset-left,0px))] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4 overflow-y-auto pr-1 -mr-1">
          
          {/* Brand Header */}
          <div className="px-1.5 pb-3 flex items-center justify-between border-b border-[#1C315A]">
            <div className="flex items-center gap-2.5">
              {/* Premium Blue 'A' Glyph Badge */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3569F6] to-[#1D4ED8] p-0.5 shrink-0 flex items-center justify-center shadow-md shadow-[#3569F6]/20">
                <span className="font-extrabold text-white text-base tracking-tighter">A</span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white tracking-tight">Aarambha</span>
                </div>
                <p className="text-[11px] text-[#7E91B2] font-medium tracking-wide">
                  CRM
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="md:hidden text-[#7E91B2] hover:text-white p-2 rounded-lg hover:bg-[#1C315A] min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Viewer Role Alert */}
          {isViewer && (
            <div className="px-1">
              <div className="flex items-center gap-2 bg-[#1C315A] border border-[#2D4A80] rounded-xl px-2.5 py-1.5">
                <Eye className="w-3.5 h-3.5 text-[#3569F6] flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider">View Only Role</p>
                  <p className="text-[10px] text-[#7E91B2]">Bookings access only</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1: OPERATIONS */}
          <div className="space-y-1">
            {visibleOperations.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                      isActive
                        ? 'bg-[#1C315A] text-white font-semibold shadow-xs'
                        : 'text-[#8F9CAE] hover:text-white hover:bg-[#15284F]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#3569F6]'
                            : 'text-[#8F9CAE] group-hover:text-white'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* SECTION 2: ADMINISTRATION */}
          {!isViewer && (
            <div className="space-y-1 pt-3 border-t border-[#1C315A]">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#63799B] mb-1.5">
                Administration
              </p>
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                        isActive
                          ? 'bg-[#1C315A] text-white font-semibold shadow-xs'
                          : 'text-[#8F9CAE] hover:text-white hover:bg-[#15284F]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-[#3569F6]'
                              : 'text-[#8F9CAE] group-hover:text-white'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* SIDEBAR SCENIC PROMO CARD (Matches Reference Design) */}
          <div className="pt-2 px-0.5">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1C315A] to-[#0D1833] border border-[#2B4374] p-3.5 shadow-md group">
              {/* Subtle background tropical foliage overlay */}
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop')"
                }}
              />
              <div className="relative z-10 space-y-2">
                <div>
                  <p className="text-[12px] font-bold text-white tracking-tight">Explore. Book. Travel.</p>
                  <p className="text-[10px] text-[#8F9CAE]">Together with Aarambha</p>
                </div>
                <a
                  href="https://aarambhatravels.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-all backdrop-blur-xs cursor-pointer border border-white/10"
                >
                  <span>View Website</span>
                  <ArrowRight className="w-3 h-3 text-[#3569F6]" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Profile & Logout Card */}
        <div className="pt-3 border-t border-[#1C315A] flex items-center justify-between px-0.5">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer p-1.5 rounded-xl hover:bg-[#15284F] transition-colors flex-1 min-w-0 mr-1.5 group"
            title="Click to view/edit account profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#1C315A] text-white border border-[#2D4A80] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#253F72] transition-colors">
              {initials}
            </div>
            <div className="overflow-hidden flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Aarambha Super Admin'}
              </p>
              <p className="text-[10px] text-[#8F9CAE] truncate capitalize">
                {isViewer ? 'Viewer' : 'Super Admin'}
              </p>
            </div>
          </div>

          <button
            id="sidebar-logout"
            title="Log Out"
            onClick={handleLogout}
            className="text-[#8F9CAE] hover:text-red-400 p-2 rounded-xl hover:bg-[#15284F] transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
