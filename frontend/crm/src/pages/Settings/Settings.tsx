import React, { useState, useEffect } from 'react';
import { getSettings } from '@/api/settings.api';
import { Loader } from '@/components/common/Loader';

export default function SettingsView() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then(d => { setSettings(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-espresso">System Settings</h3>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {Object.entries(settings).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm font-medium text-espresso">{k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
            <span className="text-sm text-gray-600 font-mono">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
