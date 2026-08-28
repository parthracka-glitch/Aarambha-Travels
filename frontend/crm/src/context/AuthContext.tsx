import React, { createContext, useState, useEffect, useCallback } from 'react';
import { checkHealthStatus, getApiBaseUrl } from '@/api/client';

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
  retryConnection: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeVertical, setActiveVertical] = useState<'all' | 'tours' | 'fleet'>('all');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('crm_token');
    if (!token) return;

    try {
      const base = getApiBaseUrl();
      const meRes = await fetch(`${base}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const me = await meRes.json();
        const adminUser: AdminUser = {
          name: me.name,
          email: me.email,
          role: me.role ?? (me.email === 'viewer1@aarambhatravels.in' ? 'viewer' : 'superadmin'),
        };
        localStorage.setItem('crm_user', JSON.stringify(adminUser));
        setUser((prev) => {
          if (!prev || prev.name !== adminUser.name || prev.email !== adminUser.email || prev.role !== adminUser.role) {
            return adminUser;
          }
          return prev;
        });
      }
    } catch (_e) {}
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const online = await checkHealthStatus(20000);
      setApiStatus(online ? 'online' : 'offline');
      if (online) {
        syncCurrentUser();
      }
      return online;
    } catch {
      setApiStatus('offline');
      return false;
    }
  }, [syncCurrentUser]);

  // Try to restore session from localStorage on mount and sync with server
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
    syncCurrentUser();
  }, [syncCurrentUser]);

  // Sync profile when window gains focus or visibility changes
  useEffect(() => {
    const onFocus = () => {
      checkConnection();
      syncCurrentUser();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkConnection();
        syncCurrentUser();
      }
    };
    const onOnline = () => {
      setApiStatus('checking');
      checkConnection();
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onOnline);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [checkConnection, syncCurrentUser]);

  // Progressive auto-reconnecting background health monitor
  useEffect(() => {
    // Initial check
    checkConnection();

    // If offline or checking, retry aggressively every 4 seconds to catch Render waking up.
    // If online, check every 45 seconds for a light heartbeat.
    const pollInterval = apiStatus === 'online' ? 45000 : 4000;
    const timer = setInterval(() => {
      checkConnection();
    }, pollInterval);

    return () => clearInterval(timer);
  }, [apiStatus, checkConnection]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/auth/login`, {
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
    const meRes = await fetch(`${base}/api/auth/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!meRes.ok) throw new Error('Failed to fetch user profile');

    const me = await meRes.json();
    const adminUser: AdminUser = {
      name: me.name,
      email: me.email,
      role: me.role ?? (email === 'viewer1@aarambhatravels.in' ? 'viewer' : 'superadmin'),
    };

    localStorage.setItem('crm_user', JSON.stringify(adminUser));
    setUser(adminUser);
    setApiStatus('online');
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
      retryConnection: checkConnection,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
