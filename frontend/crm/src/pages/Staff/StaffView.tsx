import React from 'react';
import { Badge } from '@/components/common/Badge';

export default function StaffView() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-espresso">Staff & Roles</h3>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">KP</div>
          <div>
            <p className="font-semibold text-espresso">Kushal Parakh</p>
            <p className="text-xs text-gray-500">admin@aarambhatravels.in • Super Admin</p>
          </div>
          <Badge color="green">Active</Badge>
        </div>
      </div>
    </div>
  );
}
