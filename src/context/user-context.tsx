'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAuthorizedNavItems, MenuItem } from '@/config/navigation';

interface User {
  id: string;
  name: string;
  email?: string;
  tenantId?: string;
  branchId?: string;
  role: {
    id: string;
    name: string;
    permissions: { name: string }[];
  };
  branch?: {
    id: string;
    name: string;
  };
  tenant?: {
    id: string;
    name: string;
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  mounted: boolean; // Unified hydration signal
  authFailed: boolean;
  refreshUser: () => Promise<void>;
  permissions: string[];
  navigation: MenuItem[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUser = useCallback(async () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/me', {
        headers: { 'x-user-id': userId }
      });

      if (!res.ok) {
        setAuthFailed(true);
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data.user);
        
        // Persist context for useApi and other low-level utilities
        if (data.user.tenantId) localStorage.setItem('tenantId', data.user.tenantId);
        if (data.user.branchId) localStorage.setItem('branchId', data.user.branchId);
        
        setAuthFailed(false);
      }
    } catch (e) {
      console.error("UserContext: Auth Refresh Failed", e);
      setAuthFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const permissions = React.useMemo(() => user?.role.permissions.map(p => p.name) || [], [user]);
  const navigation = React.useMemo(() => getAuthorizedNavItems(permissions), [permissions]);

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      mounted,
      authFailed, 
      refreshUser: fetchUser,
      permissions,
      navigation
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
