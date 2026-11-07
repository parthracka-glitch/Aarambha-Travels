import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  const colors: Record<string, string> = {
    green: 'bg-[#E7F7F2] text-[#12A879] border-[#BDEBDC]',
    amber: 'bg-[#FEF5EB] text-[#F3A23A] border-[#FCE1C2]',
    red: 'bg-[#FDF2F2] text-[#EF4444] border-[#FBD5D5]',
    blue: 'bg-[#EDF3FF] text-[#3569F6] border-[#D3E2FE]',
    purple: 'bg-[#F4EEFD] text-[#9560EF] border-[#E5D7FA]',
    gray: 'bg-[#F5F7FC] text-[#77839A] border-[#E8ECF4]',
    navy: 'bg-[#101F40] text-white border-[#1C315A]',
    terracotta: 'bg-[#EDF3FF] text-[#3569F6] border-[#D3E2FE]',
    sand: 'bg-[#F5F7FC] text-[#17233D] border-[#E8ECF4]',
  };

  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}
