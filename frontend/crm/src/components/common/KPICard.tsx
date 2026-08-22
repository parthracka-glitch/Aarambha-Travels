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
    peach: 'bg-[#EDEDF3] border-[#AFB2CE]/30 text-[#000000]',
    blue: 'bg-[#9CB4E8]/20 border-[#9CB4E8]/40 text-[#000000]',
    purple: 'bg-[#5266EB]/10 border-[#5266EB]/20 text-[#000000]',
    green: 'bg-[#AFB2CE]/20 border-[#AFB2CE]/40 text-[#000000]',
  };

  return (
    <div
      onClick={onClick}
      className={`${bgStyles[variant]} p-5 rounded-[24px] border shadow-aether-card flex flex-col justify-between min-h-[140px] relative overflow-hidden group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div>
        <span className="text-xs font-bold text-gray-700 block mb-0.5 tracking-tight">{label}</span>
        <span className="text-[11px] text-gray-500 font-medium">{sub || 'Total Interaction'}</span>
      </div>

      <div className="flex items-end justify-between pt-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#000000] tracking-tight">{value}</h3>
        
        {/* Circular Arrow Button */}
        <div className="w-8 h-8 rounded-full bg-[#171721] text-[#EDEDF3] flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-[#5266EB] transition-all">
          <ArrowUpRight className="w-4 h-4 text-[#EDEDF3]" />
        </div>
      </div>
    </div>
  );
}
