import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  const colors: Record<string, string> = {
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-rose-50 text-rose-800 border-rose-200',
    blue: 'bg-[#F8EFEA] text-[#C65A2E] border-[#E8B9A5]/60',
    gray: 'bg-gray-100 text-[#493B34] border-[#EDE2D0]',
    terracotta: 'bg-[#F8EFEA] text-[#C65A2E] border-[#E8B9A5]',
    sand: 'bg-[#EDE2D0]/50 text-[#2D1F18] border-[#EDE2D0]',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}
