import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { getAuditLogs } from '@/api/audit.api';
import { Loader } from '@/components/common/Loader';

export default function AuditView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getAuditLogs(50).then(d => { setLogs(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-espresso">Audit Trail & Action Logs ({logs.length})</h3>
        <button onClick={load} className="text-xs flex items-center gap-1 text-gray-500 hover:text-terracotta">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l: any, i: number) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-espresso">{l.action}</td>
                <td className="px-4 py-3 text-gray-600">{l.actorName || l.actor_name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{l.targetType || l.target_type}</td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono max-w-[200px] truncate">{JSON.stringify(l.details)}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{new Date(l.createdAt || l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
