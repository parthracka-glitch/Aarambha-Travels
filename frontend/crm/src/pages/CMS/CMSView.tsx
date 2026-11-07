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
        <h3 className="text-xl font-bold text-[#17233D]">CMS &amp; Blog Posts ({blogs.length})</h3>
        <button onClick={load} className="text-xs flex items-center gap-1.5 text-[#77839A] hover:text-[#3569F6] bg-white border border-[#E8ECF4] px-3 py-1.5 rounded-xl shadow-xs transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((b: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E8ECF4] p-5 shadow-xs hover:border-blue-200 transition-all">
            <h4 className="font-bold text-[#17233D] mb-1">{b.title}</h4>
            <p className="text-xs text-[#77839A] mb-2">/{b.slug} • {b.author}</p>
            <p className="text-xs text-gray-600 line-clamp-3">{b.summary || b.content.substring(0, 120)}</p>
          </div>
        ))}
        {blogs.length === 0 && <p className="text-sm text-gray-400 col-span-3">No blog posts found.</p>}
      </div>
    </div>
  );
}
