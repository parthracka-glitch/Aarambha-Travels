import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Calendar as CalendarIcon, Compass, Car, Users, UserCheck,
  CreditCard, Megaphone, BarChart3, Settings as SettingsIcon,
  LogOut, X, Eye, User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileModal } from './ProfileModal';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { activeVertical, setActiveVertical, user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const isViewer = user?.role === 'viewer';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const mainNav = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, superAdminOnly: true },
    { path: '/calendar', label: 'Bookings Calendar', icon: CalendarIcon, superAdminOnly: false },
    { path: '/bookings', label: 'All Bookings', icon: CalendarCheck, superAdminOnly: false },
    { path: '/tours', label: 'Tours & Packages', icon: Compass, verticalOnly: 'tours' as const, superAdminOnly: true },
    { path: '/fleet', label: 'Vehicle Fleet', icon: Car, verticalOnly: 'fleet' as const, superAdminOnly: true },
    { path: '/customers', label: 'Inquiries & Leads', icon: Users, superAdminOnly: true },
  ];

  const toolsNav = [
    { path: '/staff', label: 'Staff & Team Access', icon: UserCheck },
    { path: '/finance', label: 'Finance & Coupons', icon: CreditCard },
    { path: '/marketing', label: 'CMS & Content', icon: Megaphone },
    { path: '/analytics', label: 'Audit Logs & Security', icon: BarChart3 },
    { path: '/settings', label: 'System Settings', icon: SettingsIcon },
  ];

  const visibleMainNav = mainNav.filter((item) => {
    if (isViewer && item.superAdminOnly) return false;
    if (item.verticalOnly && activeVertical !== 'all' && activeVertical !== item.verticalOnly) return false;
    return true;
  });

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
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-[#2D1F18] text-[#FCFAF6] flex flex-col justify-between flex-shrink-0 border-r border-[#493B34]/60 py-6 px-4 select-none transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5 overflow-y-auto">
          
          {/* Brand Header & Mobile Close */}
          <div className="px-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center">
                <img
                  src="/images/aarambha_logo.png"
                  alt="Aarambha Travels Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h1 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5 leading-none">
                  <span className="text-base font-bold text-white">आरंभ</span>
                  <span className="text-[10px] font-bold text-[#C65A2E] uppercase tracking-wider bg-[#C65A2E]/10 px-1.5 py-0.5 rounded">CRM</span>
                </h1>
                <p className="text-[9px] font-bold text-[#EDE2D0]/70 uppercase tracking-widest mt-1">
                  ENTERPRISE TRAVEL PORTAL
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="md:hidden text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Viewer Role Alert */}
          {isViewer && (
            <div className="px-1">
              <div className="flex items-center gap-2 bg-[#C65A2E]/15 border border-[#C65A2E]/30 rounded-lg px-3 py-2">
                <Eye className="w-3.5 h-3.5 text-[#C65A2E] flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider">View Only Role</p>
                  <p className="text-[10px] text-[#EDE2D0]/80">Bookings access only</p>
                </div>
              </div>
            </div>
          )}

          {/* Scope Segment Picker */}
          {!isViewer && (
            <div className="px-1">
              <div className="bg-[#1E140F] p-1 rounded-lg border border-[#EDE2D0]/10 flex text-xs font-medium text-[#EDE2D0]/80">
                {(['all', 'tours', 'fleet'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      setActiveVertical(v);
                      if (v === 'tours') navigate('/tours');
                      else if (v === 'fleet') navigate('/fleet');
                      else navigate('/');
                      onClose?.();
                    }}
                    className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                      activeVertical === v
                        ? 'bg-[#C65A2E] text-white shadow-xs'
                        : 'hover:text-white hover:bg-white/5 text-[#EDE2D0]/70'
                    }`}
                  >
                    {v === 'all' ? 'All' : v === 'tours' ? 'Tours' : 'Fleet'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-[#EDE2D0]/50 uppercase tracking-widest mb-1.5">
              Operations
            </p>
            {visibleMainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#C65A2E] text-white shadow-xs font-semibold'
                        : 'text-[#EDE2D0]/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 opacity-90 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Management & Tools Section */}
          {!isViewer && activeVertical === 'all' && (
            <div className="space-y-1 pt-2 border-t border-[#EDE2D0]/10">
              <p className="px-3 text-[10px] font-bold text-[#EDE2D0]/50 uppercase tracking-widest mb-1.5">
                Administration
              </p>
              {toolsNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-[#C65A2E] text-white shadow-xs font-semibold'
                          : 'text-[#EDE2D0]/80 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 opacity-90 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          )}

        </div>

        {/* Bottom Profile & Logout Card */}
        <div className="pt-4 border-t border-[#EDE2D0]/10 flex items-center justify-between px-1">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-1 min-w-0 mr-2 group"
            title="Click to view/edit account profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#EDE2D0] text-[#2D1F18] flex items-center justify-center font-bold text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              {initials}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate group-hover:text-[#EDE2D0] transition-colors">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-[#EDE2D0]/60 truncate capitalize">
                {isViewer ? 'Viewer' : 'Super Admin'}
              </p>
            </div>
          </div>

          <button
            id="sidebar-logout"
            title="Log Out"
            onClick={handleLogout}
            className="text-[#EDE2D0]/60 hover:text-red-400 p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
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
