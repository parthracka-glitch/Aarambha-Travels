import React from 'react';

export interface KPICardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  trendLabel?: string;
  trendType?: 'up' | 'neutral' | 'down';
  icon?: React.ReactNode;
  variant?: 'blue' | 'amber' | 'purple' | 'emerald' | 'green' | 'default';
  onClick?: () => void;
}

const variantConfig: Record<string, { iconBg: string; stroke: string; fill: string; trendColor: string }> = {
  blue: {
    iconBg: 'bg-[#EDF3FF] text-[#3569F6]',
    stroke: '#3569F6',
    fill: '#EDF3FF',
    trendColor: 'text-[#12A879]',
  },
  amber: {
    iconBg: 'bg-[#FEF5EB] text-[#F3A23A]',
    stroke: '#F3A23A',
    fill: '#FEF5EB',
    trendColor: 'text-[#F3A23A]',
  },
  purple: {
    iconBg: 'bg-[#F4EEFD] text-[#9560EF]',
    stroke: '#9560EF',
    fill: '#F4EEFD',
    trendColor: 'text-[#12A879]',
  },
  emerald: {
    iconBg: 'bg-[#E7F7F2] text-[#12A879]',
    stroke: '#12A879',
    fill: '#E7F7F2',
    trendColor: 'text-[#12A879]',
  },
  green: {
    iconBg: 'bg-[#E7F7F2] text-[#12A879]',
    stroke: '#12A879',
    fill: '#E7F7F2',
    trendColor: 'text-[#12A879]',
  },
  default: {
    iconBg: 'bg-[#F5F7FC] text-[#77839A]',
    stroke: '#77839A',
    fill: '#F5F7FC',
    trendColor: 'text-[#77839A]',
  },
};

export function KPICard({
  label,
  value,
  sub,
  trend = '+12%',
  trendLabel = 'vs last week',
  trendType = 'up',
  icon,
  variant = 'default',
  onClick,
}: KPICardProps) {
  const cfg = variantConfig[variant] || variantConfig.default;

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 sm:p-5 rounded-2xl border border-[#E8ECF4] shadow-xs hover:border-[#CBD5E1] hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between min-h-[120px] relative group tap-highlight-transparent touch-manipulation ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg} shadow-2xs`}>
              {icon}
            </div>
          )}
          <div>
            <span className="text-xs font-semibold text-[#77839A] block">
              {label}
            </span>
            <h3 className="text-2xl sm:text-[30px] font-extrabold text-[#17233D] tracking-tight leading-none mt-1">
              {value}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-[#F5F7FC] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 truncate">
          <span className={`font-bold ${trendType === 'neutral' ? 'text-[#F3A23A]' : cfg.trendColor}`}>
            {trendType === 'up' ? '↑ ' : trendType === 'neutral' ? '→ ' : '↓ '}
            {trend}
          </span>
          <span className="text-[#77839A] text-[11px] font-normal truncate">
            {trendLabel}
          </span>
        </div>

        {/* Elegant SVG Mini Sparkline Curve */}
        <div className="w-16 h-6 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 64 24" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${variant}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cfg.stroke} stopOpacity="0.3" />
                <stop offset="100%" stopColor={cfg.stroke} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 18 Q 16 6, 32 14 T 64 8 L 64 24 L 0 24 Z"
              fill={`url(#grad-${variant})`}
            />
            <path
              d="M 0 18 Q 16 6, 32 14 T 64 8"
              fill="none"
              stroke={cfg.stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
