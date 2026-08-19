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
  const bgStyles = {
    peach: 'bg-[#FFF2E2] border-orange-100/80 text-gray-900',
    blue: 'bg-[#DCE8FE] border-blue-100/80 text-gray-900',
    purple: 'bg-[#EBEAF8] border-purple-100/80 text-gray-900',
    green: 'bg-[#E4F7EC] border-emerald-100/80 text-gray-900',
  };

  return (
    <div
      onClick={onClick}
      className={`${bgStyles[variant]} p-5 rounded-[24px] border shadow-aether-card flex flex-col justify-between min-h-[140px] relative overflow-hidden group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div>
        <span className="text-xs font-bold text-gray-600 block mb-0.5 tracking-tight">{label}</span>
        <span className="text-[11px] text-gray-500 font-medium">{sub || 'Total Interaction'}</span>
      </div>

      <div className="flex items-end justify-between pt-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">{value}</h3>
        
        {/* Black Circular Arrow Button matching Ai AETHER */}
        <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-black transition-all">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}
