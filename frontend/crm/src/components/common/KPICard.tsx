import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface KPICardProps {
  label: string;
  value: string;
  sub: string;
  icon?: React.ReactNode;
  variant?: 'blue' | 'amber' | 'purple' | 'emerald' | 'peach' | 'green' | 'default';
  color?: string;
  onClick?: () => void;
}

const variantConfig: Record<string, { iconBg: string; dot: string }> = {
  blue: {
    iconBg: 'bg-blue-50/80 text-blue-600 border border-blue-200/60',
    dot: 'bg-blue-500',
  },
  amber: {
    iconBg: 'bg-amber-50/80 text-amber-700 border border-amber-200/60',
    dot: 'bg-amber-500',
  },
  peach: {
    iconBg: 'bg-amber-50/80 text-amber-700 border border-amber-200/60',
    dot: 'bg-amber-500',
  },
  purple: {
    iconBg: 'bg-purple-50/80 text-purple-600 border border-purple-200/60',
    dot: 'bg-purple-500',
  },
  emerald: {
    iconBg: 'bg-emerald-50/80 text-emerald-600 border border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  green: {
    iconBg: 'bg-emerald-50/80 text-emerald-600 border border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  default: {
    iconBg: 'bg-gray-50 text-gray-600 border border-gray-200/70',
    dot: 'bg-gray-400',
  },
};

export function KPICard({ label, value, sub, icon, variant = 'default', onClick }: KPICardProps) {
  const cfg = variantConfig[variant] || variantConfig.default;

  return (
    <div
      onClick={onClick}
      className={`bg-white p-3.5 sm:p-5 rounded-xl border border-gray-200/80 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between min-h-[108px] sm:min-h-[120px] relative group tap-highlight-transparent touch-manipulation active:scale-[0.98] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate">
          {label}
        </span>
        {icon && (
          <div className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="pt-1.5 sm:pt-2">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-none">
          {value}
        </h3>
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between text-[10px] sm:text-xs pt-1 border-t border-gray-100">
          <div className="flex items-center gap-1.5 truncate text-gray-500 font-medium min-w-0">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            <span className="truncate">{sub || 'Total Interaction'}</span>
          </div>
          {onClick && (
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[11px] font-semibold text-gray-400 group-hover:text-gray-900 transition-colors shrink-0 ml-1">
              <span>View</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
