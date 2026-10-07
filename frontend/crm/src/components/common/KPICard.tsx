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

export function KPICard({ label, value, sub, onClick }: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-2xs hover:border-gray-200 hover:shadow-xs transition-all duration-150 flex flex-col justify-between min-h-[105px] relative group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</span>
        {onClick && (
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-600 transition-colors" />
        )}
      </div>

      <div className="pt-2">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight leading-none">{value}</h3>
        <p className="text-[11px] text-gray-400 mt-1.5 font-normal truncate">{sub || 'Total Interaction'}</p>
      </div>
    </div>
  );
}
