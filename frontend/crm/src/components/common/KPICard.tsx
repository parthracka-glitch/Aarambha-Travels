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
    peach: 'bg-white border-[#EDE2D0] text-[#2D1F18]',
    blue: 'bg-[#F8EFEA] border-[#E8B9A5]/60 text-[#2D1F18]',
    purple: 'bg-[#EDE2D0]/40 border-[#EDE2D0] text-[#2D1F18]',
    green: 'bg-emerald-50/80 border-emerald-200 text-[#2D1F18]',
  };

  return (
    <div
      onClick={onClick}
      className={`${bgStyles[variant]} p-5 rounded-[24px] border shadow-xs flex flex-col justify-between min-h-[140px] relative overflow-hidden group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div>
        <span className="text-xs font-bold text-[#756B63] block mb-0.5 tracking-tight">{label}</span>
        <span className="text-[11px] text-[#756B63]/80 font-medium">{sub || 'Total Interaction'}</span>
      </div>

      <div className="flex items-end justify-between pt-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D1F18] tracking-tight">{value}</h3>
        
        {/* Circular Arrow Button */}
        <div className="w-8 h-8 rounded-full bg-[#2D1F18] text-white flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#C65A2E] transition-all">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}
