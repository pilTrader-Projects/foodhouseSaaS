'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  role: {
    name: string;
    permissions: { name: string }[];
  };
  branch?: {
    id: string;
    name: string;
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  authFailed: boolean;
  refreshUser: () => Promise<void>;
  permissions: string[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);

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

  const permissions = user?.role.permissions.map(p => p.name) || [];

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      authFailed, 
      refreshUser: fetchUser,
      permissions 
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
