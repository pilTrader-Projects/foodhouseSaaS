'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/context/user-context';

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
  const { user, permissions, loading, authFailed } = useUser();
  const router = useRouter();

  // Handle Redirection logic
  useEffect(() => {
    if (!loading) {
       const hasPerm = permissions.includes(permission) || permissions.includes('tenant:admin');
       
       if (authFailed || (!hasPerm && user)) {
          if (redirectOnFail) router.push(redirectOnFail);
       }
    }
  }, [loading, authFailed, user, permissions, permission, redirectOnFail, router]);

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
