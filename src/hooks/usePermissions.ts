'use client';

import { useState, useEffect } from 'react';

/**
 * usePermissions provides role and permission checking for the UI.
 * It integrates with the /api/auth/me endpoint to understand the current session.
 */
export function usePermissions() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMe() {
            const userId = localStorage.getItem('userId') || 'user-admin';
            try {
                const res = await fetch('/api/auth/me', {
                    headers: { 'x-user-id': userId }
                });
                const data = await res.json();
                setUser(data.user);
            } catch (e) {
                console.error("Failed to fetch user permissions", e);
            } finally {
                setLoading(false);
            }
        }
        fetchMe();
    }, []);

    const hasPermission = (permissionName: string) => {
        if (!user) return false;
        // Owner has all permissions
        if (user.role?.name === 'Owner') return true;

        return user.role?.permissions?.some((p: any) => p.name === permissionName);
    };

    const isRole = (roleName: string) => {
        return user?.role?.name === roleName;
    };

    return {
        user,
        loading,
        hasPermission,
        isRole,
        branchId: user?.branchId,
    };
}
