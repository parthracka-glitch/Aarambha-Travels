import React from 'react';
import { Badge } from '@/components/common/Badge';
import { ShieldCheck, Eye, UserCheck, Mail, Lock } from 'lucide-react';

export default function StaffView() {
  const staffMembers = [
    {
      name: 'Kushal Parakh',
      initials: 'KP',
      email: 'admin@aarambhatravels.in',
      role: 'Super Admin',
      badgeColor: 'green',
      icon: ShieldCheck,
      description: 'Full access to all tours, fleet inventory, finances, bookings, and settings.',
    },
    {
      name: 'Pravin (Operations Head)',
      initials: 'PP',
      email: 'admin2@aarambhatravels.in',
      role: 'Super Admin',
      badgeColor: 'green',
      icon: ShieldCheck,
      description: 'Operations management, trip scheduling, bookings dispatch, and member lists.',
    },
    {
      name: 'Booking Viewer',
      initials: 'BV',
      email: 'viewer1@aarambhatravels.in',
      role: 'Viewer',
      badgeColor: 'amber',
      icon: Eye,
      description: 'Read-only access to view bookings, passenger manifests, and vehicle schedules.',
    },
  ];

  return (
    <div className="space-y-6 font-sans select-none">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" /> Staff &amp; Roles
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Manage system administrators and viewing permissions (2 Super Admins &middot; 1 Viewer).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffMembers.map(staff => {
          const Icon = staff.icon;
          const isSuper = staff.role === 'Super Admin';

          return (
            <div
              key={staff.email}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4 hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-sm ${
                      isSuper
                        ? 'bg-slate-900 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {staff.initials}
                  </div>
                  <Badge color={staff.badgeColor}>
                    {staff.role}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-gray-900">{staff.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{staff.email}</span>
                  </p>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {staff.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>Status: <strong className="text-emerald-600">Active</strong></span>
                <span className="flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-gray-400" /> Protected
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
