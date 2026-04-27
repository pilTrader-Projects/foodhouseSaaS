'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  role: {
    name: string;
    permissions: { name: string }[];
  };
}

interface RBACGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectOnFail?: string;
}

/**
 * RBACGate protects child components based on user permissions.
 * Hardened to handle auth failures silently without crashing.
 */
export function RBACGate({ 
  permission, 
  children, 
  fallback, 
  redirectOnFail 
}: RBACGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'user-admin' : 'user-admin';
        const res = await fetch('/api/auth/me', {
          headers: { 'x-user-id': userId }
        });
        
        if (!res.ok) {
           if (isMounted) setAuthFailed(true);
           return;
        }
        
        const data = await res.json();
        if (isMounted) setUser(data.user);
      } catch (e) {
        console.warn("RBAC Silence: Auth check interrupted", e);
        if (isMounted) setAuthFailed(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  // Handle Redirection logic in a separate effect to avoid state sync issues during render
  useEffect(() => {
    if (!loading) {
       const hasPerm = user?.role.permissions.some(p => 
         p.name === permission || p.name === 'tenant:admin'
       );
       
       if (authFailed || (!hasPerm && user)) {
          if (redirectOnFail) router.push(redirectOnFail);
       }
    }
  }, [loading, authFailed, user, permission, redirectOnFail, router]);

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" />
      </div>
    );
  }

  const hasPermission = user?.role.permissions.some(p => 
    p.name === permission || p.name === 'tenant:admin'
  );

  if (authFailed || !hasPermission) {
    if (redirectOnFail) return null; // Let the redirect effect handle it
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
