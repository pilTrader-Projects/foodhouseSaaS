'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from './use-api';
import { useUser } from '@/context/user-context';

export interface DashboardData {
  sales: number;
  performance: any[];
  stockAlerts: any[];
}

/**
 * useDashboardStats handles data orchestration for the main dashboard.
 * Implements "Silent Refresh" polling for a real-time experience without UI flickering.
 */
export function useDashboardStats(pollingInterval = 30000) {
  const { user, loading: authLoading } = useUser();
  const { request, error, errorType, loading: initialLoading } = useApi();
  const [data, setData] = useState<DashboardData>({
    sales: 0,
    performance: [],
    stockAlerts: [],
  });
  
  const isRefreshing = useRef(false);

  const fetchData = useCallback(async (isSilent = false) => {
    if (isRefreshing.current) return;
    isRefreshing.current = true;

    try {
      const [salesData, perfData, stockData] = await Promise.all([
        request('/api/analytics/global-sales', { silent: isSilent }),
        request('/api/analytics/branch-performance', { silent: isSilent }),
        request('/api/analytics/critical-stock', { silent: isSilent }),
      ]);

      setData({
        sales: salesData?.totalSales || 0,
        performance: perfData?.performance || [],
        stockAlerts: stockData?.criticalStock || [],
      });
    } catch (e) {
      console.error('Dashboard sync failed:', e);
    } finally {
      isRefreshing.current = false;
    }
  }, [request]);

  useEffect(() => {
    if (authLoading || !user) return;
    
    // Initial fetch (visible loading)
    fetchData(false);

    // Background polling (silent)
    const interval = setInterval(() => fetchData(true), pollingInterval);
    
    return () => clearInterval(interval);
  }, [authLoading, user, fetchData, pollingInterval]);

  return {
    data,
    loading: initialLoading && data.sales === 0, // Only show loading for the very first fetch
    error,
    errorType,
    refresh: () => fetchData(false)
  };
}
