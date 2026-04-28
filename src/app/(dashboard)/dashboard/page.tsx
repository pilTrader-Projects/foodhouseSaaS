'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Store, 
  AlertTriangle, 
  ArrowUpRight, 
  Package, 
  CreditCard,
  ChefHat
} from 'lucide-react';
import { RBACGate } from '@/components/auth/rbac-gate';

import { useUser } from '@/context/user-context';
import { useApi } from '@/hooks/use-api';

export default function PremiumDashboard() {
  const router = useRouter();
  const { user, permissions, loading: authLoading } = useUser();
  const [data, setData] = useState({
    sales: 0,
    performance: [] as any[],
    stockAlerts: [] as any[],
  });
  const { request, loading: apiLoading, error: apiError } = useApi();

  useEffect(() => {
    if (authLoading) return;

    if (user) {
        const role = user.role.name;
        if (role === 'Chef') {
            router.push('/kitchen');
            return;
        }
        if (role === 'Staff') {
            router.push('/pos');
            return;
        }
    }

    async function fetchDashboardData() {
      try {
        const results = await Promise.allSettled([
          request('/api/analytics/global-sales'),
          request('/api/analytics/branch-performance'),
          request('/api/analytics/critical-stock'),
        ]);

        const [salesData, perfData, stockData] = results.map(r => 
          r.status === 'fulfilled' ? r.value : null
        );

        setData({
          sales: salesData?.totalSales || 0,
          performance: perfData?.performance || [],
          stockAlerts: stockData?.criticalStock || [],
        });
      } catch (e) {
        // Error is handled by apiError from useApi
      }
    }
    fetchDashboardData();
  }, [authLoading, user, router, request]);

  if (apiError) {
    return (
      <RBACGate permission="access:dashboard" redirectOnFail="/pos">
        <div className="min-h-[60vh] flex-center">
            <div className="card-minimal p-12 max-w-xl w-full text-center space-y-6 animate-fade-in border-rose-100 bg-rose-50/30">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex-center mx-auto">
                    <AlertTriangle className="w-10 h-10 text-rose-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-main">Feature Restricted</h2>
                    <p className="text-muted font-medium">{apiError}</p>
                </div>
                <div className="pt-4">
                    <button 
                        onClick={() => router.push('/settings/billing')}
                        className="btn-minimal btn-accent px-8"
                    >
                        View Upgrade Options
                    </button>
                </div>
            </div>
        </div>
      </RBACGate>
    )
  }

  return (
    <RBACGate permission="access:dashboard" redirectOnFail="/pos">
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-main leading-tight">Operational Overview</h1>
              <p className="text-muted font-medium">Monitoring {data.performance.length} branches across the organization.</p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="stats-grid">
            <div className="card-minimal p-8 flex-col gap-4">
              <div className="flex-between">
                 <CreditCard className="w-6 h-6 text-accent" />
                 <span className="text-emerald-600 text-xs font-black">+12.5%</span>
              </div>
              <div>
                <h3 className="text-muted text-xs font-bold uppercase tracking-widest">Total Sales</h3>
                <div className="text-3xl font-black text-main mt-1">
                  {apiLoading ? '---' : `₱${data.sales.toLocaleString()}`}
                </div>
              </div>
            </div>

            <div className="card-minimal p-8 flex-col gap-4">
               <Store className="w-6 h-6 text-accent" />
               <div>
                  <h3 className="text-muted text-xs font-bold uppercase tracking-widest">Active Branches</h3>
                  <div className="text-3xl font-black text-main mt-1">
                    {apiLoading ? '-' : data.performance.length}
                  </div>
               </div>
            </div>

            <div className="card-minimal p-8 flex-col gap-4">
               <AlertTriangle className={data.stockAlerts.length > 0 ? 'text-rose-600' : 'text-accent'} />
               <div>
                  <h3 className="text-muted text-xs font-bold uppercase tracking-widest">Inventory Alerts</h3>
                  <div className={`text-3xl font-black mt-1 ${data.stockAlerts.length > 0 ? 'text-rose-600' : 'text-main'}`}>
                    {apiLoading ? '-' : data.stockAlerts.length}
                  </div>
               </div>
            </div>
          </div>
        </div>
        <style jsx>{`
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        `}</style>
    </RBACGate>
  );
}
