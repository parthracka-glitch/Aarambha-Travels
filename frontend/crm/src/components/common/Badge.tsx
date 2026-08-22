import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  const colors: Record<string, string> = {
    green: 'bg-[#EDEDF3] text-[#171721] border-[#AFB2CE]/40',
    amber: 'bg-[#9CB4E8]/20 text-[#171721] border-[#9CB4E8]/40',
    red: 'bg-[#5266EB]/15 text-[#5266EB] border-[#5266EB]/30',
    blue: 'bg-[#5266EB]/10 text-[#5266EB] border-[#5266EB]/30',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    terracotta: 'bg-[#5266EB]/10 text-[#5266EB] border-[#9CB4E8]/40',
    sand: 'bg-[#AFB2CE]/20 text-[#171721] border-[#AFB2CE]/40',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}
