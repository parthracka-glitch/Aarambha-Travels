import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  sub: string;
  variant?: 'peach' | 'blue' | 'purple' | 'green';
  color?: string;
  onClick?: () => void;
}

export function KPICard({ label, value, sub, variant = 'peach', color, onClick }: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs hover:border-gray-300 hover:shadow-xs transition-all duration-150 flex flex-col justify-between min-h-[125px] relative group cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
        <div className="w-6 h-6 rounded-md bg-gray-50 border border-gray-100 text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-100 flex items-center justify-center transition-colors">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">{value}</h3>
        <p className="text-xs text-gray-500 mt-0.5 font-normal">{sub || 'Total Interaction'}</p>
      </div>
    </div>
  );
}
