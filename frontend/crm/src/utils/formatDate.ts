export function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN');
}

export function formatDateTime(dateStr?: string | Date): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-IN');
}
