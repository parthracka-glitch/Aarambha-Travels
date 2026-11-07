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
        <h3 className="text-xl font-bold text-[#17233D]">Audit Trail &amp; Action Logs ({logs.length})</h3>
        <button onClick={load} className="text-xs flex items-center gap-1.5 text-[#77839A] hover:text-[#3569F6] bg-white border border-[#E8ECF4] px-3 py-1.5 rounded-xl shadow-xs transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-[#E8ECF4] overflow-hidden shadow-xs">
        <table className="w-full text-xs">
          <thead className="bg-[#101F40] text-left text-[11px] text-[#F5F7FC] uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5 font-bold">Action</th>
              <th className="px-5 py-3.5 font-bold">Actor</th>
              <th className="px-5 py-3.5 font-bold">Target</th>
              <th className="px-5 py-3.5 font-bold">Details</th>
              <th className="px-5 py-3.5 font-bold">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8ECF4]">
            {logs.map((l: any, i: number) => (
              <tr key={i} className="hover:bg-[#F5F7FC]/70 transition-colors">
                <td className="px-5 py-3.5 font-bold text-[#17233D]">{l.action}</td>
                <td className="px-5 py-3.5 text-gray-700 font-medium">{l.actorName || l.actor_name}</td>
                <td className="px-5 py-3.5 text-xs text-[#77839A]">{l.targetType || l.target_type}</td>
                <td className="px-5 py-3.5 text-xs text-[#77839A] font-mono max-w-[200px] truncate">{JSON.stringify(l.details)}</td>
                <td className="px-5 py-3.5 text-xs text-[#77839A]">{new Date(l.createdAt || l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
