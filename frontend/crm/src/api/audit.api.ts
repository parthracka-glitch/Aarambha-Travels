import { apiFetch } from './client';

export const getAuditLogs = (limit = 50) => apiFetch(`/api/analytics/audit-logs?limit=${limit}`);
