import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/Login/LoginPage';
import DashboardView from '@/pages/Dashboard/Dashboard';
import BookingsView from '@/pages/Bookings/BookingsView';
import InquiriesView from '@/pages/Inquiries/InquiriesView';
import ToursView from '@/pages/Tours/ToursList';
import FleetView from '@/pages/Fleet/FleetList';
import FinanceView from '@/pages/Finance/FinanceDashboard';
import CMSView from '@/pages/CMS/CMSView';
import AuditView from '@/pages/Audit/AuditView';
import SettingsView from '@/pages/Settings/Settings';
import StaffView from '@/pages/Staff/StaffView';
import { DashboardLayout } from '@/templates/DashboardLayout';
import { ProtectedRoute, SuperAdminRoute } from '@/routes/ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated — any role */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Viewer-accessible routes */}
          <Route path="/bookings" element={<BookingsView />} />
          <Route path="/admin/bookings" element={<Navigate to="/bookings" replace />} />

          {/* SuperAdmin-only routes — viewer gets redirected to /bookings */}
          <Route element={<SuperAdminRoute />}>
            <Route path="/" element={<DashboardView />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/admin/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/tours" element={<ToursView />} />
            <Route path="/packages" element={<Navigate to="/tours" replace />} />
            <Route path="/admin/packages" element={<Navigate to="/tours" replace />} />
            <Route path="/admin/tours" element={<Navigate to="/tours" replace />} />
            <Route path="/fleet" element={<FleetView />} />
            <Route path="/vehicles" element={<Navigate to="/fleet" replace />} />
            <Route path="/admin/fleet" element={<Navigate to="/fleet" replace />} />
            <Route path="/rates" element={<Navigate to="/fleet" replace />} />
            <Route path="/admin/rates" element={<Navigate to="/fleet" replace />} />
            <Route path="/drivers" element={<Navigate to="/staff" replace />} />
            <Route path="/admin/drivers" element={<Navigate to="/staff" replace />} />
            <Route path="/customers" element={<InquiriesView />} />
            <Route path="/inquiries" element={<Navigate to="/customers" replace />} />
            <Route path="/admin/customers" element={<Navigate to="/customers" replace />} />
            <Route path="/staff" element={<StaffView />} />
            <Route path="/admin/staff" element={<Navigate to="/staff" replace />} />
            <Route path="/finance" element={<FinanceView />} />
            <Route path="/admin/finance" element={<Navigate to="/finance" replace />} />
            <Route path="/marketing" element={<CMSView />} />
            <Route path="/cms" element={<Navigate to="/marketing" replace />} />
            <Route path="/admin/marketing" element={<Navigate to="/marketing" replace />} />
            <Route path="/analytics" element={<AuditView />} />
            <Route path="/audit" element={<Navigate to="/analytics" replace />} />
            <Route path="/admin/analytics" element={<Navigate to="/analytics" replace />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/admin/settings" element={<Navigate to="/settings" replace />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/bookings" replace />} />
    </Routes>
  );
}
