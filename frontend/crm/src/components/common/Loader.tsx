import React from 'react';
import { RefreshCw } from 'lucide-react';

export function Loader() {
  return (
    <div className="flex items-center justify-center h-48 text-gray-400">
      <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading…
    </div>
  );
}
