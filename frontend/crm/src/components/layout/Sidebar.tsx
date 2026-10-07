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
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white text-gray-900 flex flex-col justify-between flex-shrink-0 border-r border-gray-100 py-4 px-3 select-none transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-3.5 overflow-y-auto">
          
          {/* Brand Header & Mobile Close */}
          <div className="px-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 p-1 shrink-0 flex items-center justify-center">
                <img
                  src="/images/aarambha_logo.png"
                  alt="Aarambha Travels Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-gray-900 tracking-tight">आरंभ</span>
                  <span className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">CRM</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Travel & Fleet Portal
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="md:hidden text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Viewer Role Alert */}
          {isViewer && (
            <div className="px-0.5">
              <div className="flex items-center gap-2 bg-amber-50/70 border border-amber-200/60 rounded-lg px-2.5 py-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">View Only Role</p>
                  <p className="text-[10px] text-amber-700">Bookings access only</p>
                </div>
              </div>
            </div>
          )}

          {/* Scope Segment Picker */}
          {!isViewer && (
            <div className="px-0.5">
              <div className="bg-gray-100/70 p-0.5 rounded-lg flex text-xs font-medium">
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
                    className={`flex-1 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-center ${
                      activeVertical === v
                        ? 'bg-white text-gray-900 shadow-xs font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {v === 'all' ? 'All' : v === 'tours' ? 'Tours' : 'Fleet'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <div className="space-y-0.5">
            <p className="px-2.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">
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
                    `group w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-gray-900'
                            : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Management & Tools Section */}
          {!isViewer && activeVertical === 'all' && (
            <div className="space-y-0.5 pt-3 border-t border-gray-100">
              <p className="px-2.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">
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
                      `group w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-gray-900'
                              : 'text-gray-400 group-hover:text-gray-600'
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

        </div>

        {/* Bottom Profile & Logout Card */}
        <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between px-0.5">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors flex-1 min-w-0 mr-1.5 group"
            title="Click to view/edit account profile"
          >
            <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-semibold text-[11px] shrink-0 group-hover:bg-gray-200 transition-colors">
              {initials}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-gray-400 truncate capitalize">
                {isViewer ? 'Viewer' : 'Super Admin'}
              </p>
            </div>
          </div>

          <button
            id="sidebar-logout"
            title="Log Out"
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
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
