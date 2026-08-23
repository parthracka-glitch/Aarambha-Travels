import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';

export function DashboardLayout() {
  const { apiStatus } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

        {/* Dynamic Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-24 md:pb-6">
          <div className="w-full max-w-[1720px] mx-auto">
            {apiStatus === 'offline' ? (
              <div className="bg-red-50/90 border border-red-200/80 rounded-3xl p-6 text-center shadow-sm my-4 max-w-xl mx-auto">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-bold text-red-800 mb-1">Backend API Unreachable</h3>
                <p className="text-sm text-red-600 mb-4">
                  Unable to connect to the backend server. If using Render, it may be waking up from sleep mode.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>

        {/* Native Mobile Bottom Navigation Bar */}
        <MobileBottomNav onOpenMenu={() => setMobileSidebarOpen(true)} />

      </div>

    </div>
  );
}
