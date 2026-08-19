import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  const colors: Record<string, string> = {
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
    terracotta: 'bg-orange-50 text-orange-700 border-orange-200',
    sand: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}
