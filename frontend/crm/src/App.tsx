import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AppRoutes } from '@/routes/AppRoutes';
import DeploymentAutoRefresh from '@/components/shared/DeploymentAutoRefresh';

export default function App() {
  return (
    <BrowserRouter>
      <DeploymentAutoRefresh />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
