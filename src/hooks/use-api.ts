'use client';

import { useState, useCallback } from 'react';

/**
 * Standardized API Hook
 * Unifies loading states, error extraction, and fetch configuration.
 */
export function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = useCallback(async (url: string, options: RequestInit = {}) => {
        setLoading(true);
        setError(null);

        const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') : null;
        const branchId = typeof window !== 'undefined' ? localStorage.getItem('branchId') : null;
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
            ...(branchId ? { 'x-branch-id': branchId } : {}),
            ...(userId ? { 'x-user-id': userId } : {}),
            ...options.headers,
        } as any;

        try {
            const res = await fetch(url, { ...options, headers });
            const data = await res.json();

            if (!res.ok) {
                const errMsg = data.error || data.message || 'An unexpected error occurred';
                setError(errMsg);
                throw new Error(errMsg);
            }

            return data;
        } catch (e: any) {
            if (!error) setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    return { request, loading, error, setError };
}
