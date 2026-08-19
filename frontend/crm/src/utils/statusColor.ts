export function statusColor(s: string): string {
  if (!s) return 'gray';
  const lower = s.toLowerCase();
  if (lower.includes('refund')) return 'green';
  if (lower.includes('return')) return 'blue';
  if (lower.includes('picked') || lower.includes('paid')) return 'green';
  if (lower.includes('deposit')) return 'amber';
  if (lower.includes('new')) return 'blue';
  if (lower.includes('cancel') || lower.includes('lost')) return 'red';
  return 'gray';
}
