import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Compass, Car, Users, UserCheck,
  CreditCard, Megaphone, BarChart3, Settings as SettingsIcon,
  LogOut, X, Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { activeVertical, setActiveVertical, user, logout } = useAuth();
  const navigate = useNavigate();
  const isViewer = user?.role === 'viewer';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const mainNav = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, superAdminOnly: true },
    { path: '/bookings', label: 'Bookings', icon: CalendarCheck, superAdminOnly: false },
    { path: '/tours', label: 'Tours & Packages', icon: Compass, verticalOnly: 'tours' as const, superAdminOnly: true },
    { path: '/fleet', label: 'Rental Inventory', icon: Car, verticalOnly: 'fleet' as const, superAdminOnly: true },
    { path: '/customers', label: 'Inquiries & Leads', icon: Users, superAdminOnly: true },
  ];

  const toolsNav = [
    { path: '/staff', label: 'Staff & Roles', icon: UserCheck },
    { path: '/finance', label: 'Finance & Promos', icon: CreditCard },
    { path: '/marketing', label: 'CMS & Blogs', icon: Megaphone },
    { path: '/analytics', label: 'Audit Logs', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  // Viewer sees only bookings
  const visibleMainNav = mainNav.filter(item => {
    if (isViewer && item.superAdminOnly) return false;
    if (item.verticalOnly && activeVertical !== 'all' && activeVertical !== item.verticalOnly) return false;
    return true;
  });

  return (
    <aside
      className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-[#F3F5F9] text-gray-800 flex flex-col justify-between flex-shrink-0 border-r border-gray-200/60 py-6 px-4 select-none transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="space-y-5 overflow-y-auto">
        
        {/* Brand Header & Mobile Close */}
        <div className="px-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white p-0.5 ring-1 ring-gray-200 shadow-sm shrink-0 overflow-hidden">
              <img src="/logo.jpeg" alt="आरंभ Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-[#111827] tracking-tight flex items-center gap-1.5 leading-none">
                <span className="font-['Mukta',sans-serif] text-base font-bold text-[#FF3B30]">आरंभ</span>
                <span className="text-[10px] font-medium text-gray-400">CRM</span>
              </h1>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5">Tours & Fleet Admin</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewer Role Badge */}
        {isViewer && (
          <div className="px-1">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/60 rounded-xl px-3 py-2">
              <Eye className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">View Only</p>
                <p className="text-[10px] text-amber-600">Bookings access only</p>
              </div>
            </div>
          </div>
        )}

        {/* Active Scope Filter — superadmin only */}
        {!isViewer && (
          <div className="px-1">
            <div className="bg-gray-200/70 p-1 rounded-full border border-gray-300/40 flex text-xs font-medium text-gray-600">
              {(['all', 'tours', 'fleet'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setActiveVertical(v)}
                  className={`flex-1 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                    activeVertical === v
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'hover:text-gray-900 hover:bg-white/50 text-gray-500'
                  }`}
                >
                  {v === 'all' ? 'All' : v === 'tours' ? 'Tours' : 'Rental'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            Main
          </p>
          {visibleMainNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#111827] text-white shadow-sm font-semibold'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 opacity-90" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Management & Tools Section — superadmin only, all scope */}
        {!isViewer && activeVertical === 'all' && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Management & Tools
            </p>
            {toolsNav.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#111827] text-white shadow-sm font-semibold'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 opacity-90" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

      </div>

      {/* Bottom Profile & Logout Card */}
      <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm ${isViewer ? 'bg-amber-500' : 'bg-indigo-600'}`}>
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-gray-400 truncate capitalize">{isViewer ? 'Viewer' : 'Super Admin'}</p>
          </div>
        </div>
        <button
          id="sidebar-logout"
          title="Logout"
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
}
