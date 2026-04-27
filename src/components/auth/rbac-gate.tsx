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
 */
export function RBACGate({ 
  permission, 
  children, 
  fallback, 
  redirectOnFail 
}: RBACGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const userId = localStorage.getItem('userId') || 'user-admin';
        const res = await fetch('/api/auth/me', {
          headers: { 'x-user-id': userId }
        });
        
        if (!res.ok) throw new Error('Unauthorized');
        
        const data = await res.json();
        setUser(data.user);
      } catch (e) {
        console.error("RBAC Check Failed", e);
        if (redirectOnFail) router.push(redirectOnFail);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router, redirectOnFail]);

  if (loading) {
    return (
      <div className="min-h-[200px] flex-center">
        <Loader2 className="animate-spin text-muted" />
      </div>
    );
  }

  const hasPermission = user?.role.permissions.some(p => 
    p.name === permission || p.name === 'tenant:admin'
  );

  if (!hasPermission) {
    if (redirectOnFail) {
      router.push(redirectOnFail);
      return null;
    }
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
