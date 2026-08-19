import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { getBlogs } from '@/api/cms.api';
import { Loader } from '@/components/common/Loader';

export default function CMSView() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getBlogs().then(d => { setBlogs(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-espresso">CMS & Blog Posts ({blogs.length})</h3>
        <button onClick={load} className="text-xs flex items-center gap-1 text-gray-500 hover:text-terracotta">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((b: any, i: number) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="font-bold text-espresso mb-1">{b.title}</h4>
            <p className="text-xs text-gray-500 mb-2">/{b.slug} • {b.author}</p>
            <p className="text-sm text-gray-600 line-clamp-3">{b.summary || b.content.substring(0, 120)}</p>
          </div>
        ))}
        {blogs.length === 0 && <p className="text-sm text-gray-400 col-span-3">No blog posts found.</p>}
      </div>
    </div>
  );
}
