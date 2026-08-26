import React from 'react';

interface LegalSectionProps {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'info' | 'warning' | 'critical';
}

/**
 * Reusable section block for legal pages.
 * Renders a numbered heading with anchor ID and styled content area.
 */
export default function LegalSection({ id, number, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-8 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Section number badge */}
        <div className="shrink-0 w-8 h-8 rounded-lg bg-[#5266EB]/10 border border-[#5266EB]/20 flex items-center justify-center mt-0.5">
          <span className="text-[10px] font-black text-[#5266EB] font-['Syne',sans-serif]">
            §{number}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-['Syne',sans-serif] text-lg sm:text-xl font-bold text-[#111111] tracking-tight mb-4">
            {title}
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Highlighted info/callout box within a section */
export function LegalCallout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'critical' | 'success';
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-xs leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}

/** A definition-style row for key-value pairs */
export function LegalDefinition({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-1.5 border-b border-gray-100 last:border-b-0">
      <dt className="w-32 sm:w-40 shrink-0 text-xs font-semibold text-gray-800">{term}</dt>
      <dd className="text-xs text-gray-600 flex-1">{children}</dd>
    </div>
  );
}

/** Refund table row */
export function RefundRow({ period, percentage, note }: { period: string; percentage: string; note?: string }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-[#5266EB]/[0.02]">
      <td className="py-2.5 pr-6 text-xs font-medium text-gray-800">{period}</td>
      <td className="py-2.5 pr-6 text-xs">
        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
          percentage === 'No Refund'
            ? 'bg-red-100 text-red-700'
            : parseInt(percentage) >= 80
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {percentage}
        </span>
      </td>
      {note && <td className="py-2.5 text-xs text-gray-500 italic">{note}</td>}
    </tr>
  );
}
