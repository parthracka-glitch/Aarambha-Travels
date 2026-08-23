import React, { createContext, useState, useEffect, useCallback } from 'react';
import { checkHealthStatus } from '@/api/client';

export interface AdminUser {
  name: string;
  email: string;
  role: 'superadmin' | 'viewer';
}

export interface AuthContextType {
  activeVertical: 'all' | 'tours' | 'fleet';
  setActiveVertical: (v: 'all' | 'tours' | 'fleet') => void;
  apiStatus: 'checking' | 'online' | 'offline';
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: AdminUser, newToken?: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeVertical, setActiveVertical] = useState<'all' | 'tours' | 'fleet'>('all');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    const savedUser = localStorage.getItem('crm_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('crm_token');
        localStorage.removeItem('crm_user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkHealthStatus().then(online => {
      setApiStatus(online ? 'online' : 'offline');
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }

    const { access_token } = await res.json();
    localStorage.setItem('crm_token', access_token);

    // Fetch user profile
    const meRes = await fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!meRes.ok) throw new Error('Failed to fetch user profile');

    const me = await meRes.json();
    const adminUser: AdminUser = {
      name: me.name,
      email: me.email,
      role: me.role ?? 'viewer',
    };

    localStorage.setItem('crm_user', JSON.stringify(adminUser));
    setUser(adminUser);
  }, []);

  const updateUser = useCallback((updatedUser: AdminUser, newToken?: string) => {
    if (newToken) {
      localStorage.setItem('crm_token', newToken);
    }
    localStorage.setItem('crm_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setUser(null);
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{
      activeVertical,
      setActiveVertical,
      apiStatus,
      user,
      isAuthenticated: !!user,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
