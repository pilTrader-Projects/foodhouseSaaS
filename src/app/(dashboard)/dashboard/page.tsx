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

export default function PremiumDashboard() {
  const router = useRouter();
  const [data, setData] = useState({
    sales: 0,
    performance: [] as any[],
    stockAlerts: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'user-admin' : 'user-admin';
      const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || 'tenant-demo' : 'tenant-demo';
      
      try {
        const res = await fetch('/api/auth/me', { headers: { 'x-user-id': userId } });
        const meData = await res.json();
        const role = meData.user.role.name;

        // Perspective Redirects
        if (role === 'Chef') {
            router.push('/kitchen');
            return;
        }
        if (role === 'Staff') {
            router.push('/pos');
            return;
        }

        // Load Analytics if allowed
        const [salesRes, perfRes, stockRes] = await Promise.all([
          fetch('/api/analytics/global-sales', { headers: { 'x-tenant-id': tenantId } }),
          fetch('/api/analytics/branch-performance', { headers: { 'x-tenant-id': tenantId } }),
          fetch('/api/analytics/critical-stock', { headers: { 'x-tenant-id': tenantId } }),
        ]);

        const [salesData, perfData, stockData] = await Promise.all([
          salesRes.json(),
          perfRes.json(),
          stockRes.json(),
        ]);

        setData({
          sales: salesData.totalSales || 0,
          performance: perfData.performance || [],
          stockAlerts: stockData.criticalStock || [],
        });
      } catch (e) {
        console.error("Dashboard Init Error", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

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
                  {loading ? '---' : `₱${data.sales.toLocaleString()}`}
                </div>
              </div>
            </div>

            <div className="card-minimal p-8 flex-col gap-4">
               <Store className="w-6 h-6 text-accent" />
               <div>
                  <h3 className="text-muted text-xs font-bold uppercase tracking-widest">Active Branches</h3>
                  <div className="text-3xl font-black text-main mt-1">
                    {loading ? '-' : data.performance.length}
                  </div>
               </div>
            </div>

            <div className="card-minimal p-8 flex-col gap-4">
               <AlertTriangle className={data.stockAlerts.length > 0 ? 'text-rose-600' : 'text-accent'} />
               <div>
                  <h3 className="text-muted text-xs font-bold uppercase tracking-widest">Inventory Alerts</h3>
                  <div className={`text-3xl font-black mt-1 ${data.stockAlerts.length > 0 ? 'text-rose-600' : 'text-main'}`}>
                    {loading ? '-' : data.stockAlerts.length}
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
