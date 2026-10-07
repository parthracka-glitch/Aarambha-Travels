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

const variantConfig: Record<string, { iconBg: string; dot: string; hoverBorder: string }> = {
  blue: {
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    dot: 'bg-blue-500',
    hoverBorder: 'hover:border-blue-300',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    dot: 'bg-amber-500',
    hoverBorder: 'hover:border-amber-300',
  },
  peach: {
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    dot: 'bg-amber-500',
    hoverBorder: 'hover:border-amber-300',
  },
  purple: {
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
    dot: 'bg-purple-500',
    hoverBorder: 'hover:border-purple-300',
  },
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    dot: 'bg-emerald-500',
    hoverBorder: 'hover:border-emerald-300',
  },
  green: {
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    dot: 'bg-emerald-500',
    hoverBorder: 'hover:border-emerald-300',
  },
  default: {
    iconBg: 'bg-gray-100 text-gray-600 border border-gray-200/60',
    dot: 'bg-gray-400',
    hoverBorder: 'hover:border-gray-300',
  },
};

export function KPICard({ label, value, sub, icon, variant = 'default', onClick }: KPICardProps) {
  const cfg = variantConfig[variant] || variantConfig.default;

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 sm:p-5 rounded-xl border border-gray-200/90 shadow-xs transition-all duration-150 flex flex-col justify-between min-h-[114px] relative group ${
        onClick ? `cursor-pointer hover:shadow-sm ${cfg.hoverBorder}` : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate">
          {label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {icon && (
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
              {icon}
            </div>
          )}
          {onClick && (
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-700 transition-colors" />
          )}
        </div>
      </div>

      <div className="pt-2">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-none">
          {value}
        </h3>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
          <p className="text-[11px] text-gray-500 font-medium truncate">
            {sub || 'Total Interaction'}
          </p>
        </div>
      </div>
    </div>
  );
}
