import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2, RefreshCw, X, WifiOff } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';

export function DashboardLayout() {
  const { apiStatus, retryConnection } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [dismissedOfflineBanner, setDismissedOfflineBanner] = useState(false);

  const handleManualRetry = async () => {
    setIsRetrying(true);
    await retryConnection();
    setIsRetrying(false);
  };

  return (
    <div className="min-h-screen h-screen w-full bg-[#FAFAFC] flex overflow-hidden font-sans relative">
      
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Sleek Light Sidebar */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Full-Screen Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFC] w-full relative">
        
        {/* Integrated Topbar */}
        <Topbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Non-Blocking Reconnecting / Offline Notification Banner */}
        {apiStatus === 'offline' && !dismissedOfflineBanner && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 sm:px-6 py-2 flex items-center justify-between text-xs text-amber-900 transition-all shadow-xs animate-fade-in z-20">
            <div className="flex items-center gap-2 max-w-2xl">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
              <span className="font-medium text-[11px] sm:text-xs">
                Connecting to backend services... Auto-reconnecting in background (Render spin-up mode).
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleManualRetry}
                disabled={isRetrying}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold rounded-lg text-[10px] sm:text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Connecting...' : 'Retry'}
              </button>
              <button
                onClick={() => setDismissedOfflineBanner(true)}
                className="p-1 text-amber-700 hover:text-amber-950 rounded-md transition-colors"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Scrollable Page Content — NEVER BLOCKED */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-24 md:pb-6">
          <div className="w-full max-w-[1720px] mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Native Mobile Bottom Navigation Bar */}
        <MobileBottomNav onOpenMenu={() => setMobileSidebarOpen(true)} />

      </div>

    </div>
  );
}

