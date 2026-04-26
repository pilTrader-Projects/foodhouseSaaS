'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Store, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  CreditCard,
  ChefHat
} from 'lucide-react';

export default function PremiumDashboard() {
  const [data, setData] = useState({
    sales: 0,
    performance: [] as any[],
    stockAlerts: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);

  useEffect(() => {
    const savedTenant = localStorage.getItem('demo_tenant');
    if (savedTenant) {
      setTenant(JSON.parse(savedTenant));
    }

    async function fetchDashboardData() {
      const tenantId = localStorage.getItem('tenantId') || 'tenant-demo';
      try {
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
        console.error("Failed to fetch analytics", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (tenant?.plan === 'basic') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
        <div className="p-6 bg-gradient-to-tr from-amber-50 to-amber-100 rounded-full mb-6">
          <TrendingUp className="w-12 h-12 text-amber-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Upgrade to Pro Analytics</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
          Consolidated dashboards, multi-branch comparisons, and real-time inventory tracking are available on Pro and Enterprise plans.
        </p>
        <button 
          className="bg-primary text-white font-semibold py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/30 hover:scale-105 transition-transform active:scale-95"
          onClick={() => {
            localStorage.setItem('demo_tenant', JSON.stringify({...tenant, plan: 'pro'}));
            window.location.reload();
          }}
        >
          Unlock Executive Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">Operational Overview</h1>
          <p className="text-slate-500 font-medium">Monitoring {data.performance.length} branches across {tenant?.name || 'the business'}.</p>
        </div>
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold">Today</button>
          <button className="px-4 py-2 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">7 Days</button>
          <button className="px-4 py-2 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">30 Days</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="relative overflow-hidden group">
          <div className="card h-full bg-white relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
              </span>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total System Revenue</h3>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {loading ? '---' : `₱${data.sales.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
        </div>

        <div className="card bg-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-slate-400 text-xs font-bold">Active Now</span>
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Operational Branches</h3>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {loading ? '-' : data.performance.length}
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            {data.stockAlerts.length > 0 && (
              <span className="animate-pulse bg-rose-600 w-2 h-2 rounded-full shadow-lg shadow-rose-600/50"></span>
            )}
          </div>
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Inventory Alerts</h3>
          <div className={`text-3xl font-black mt-2 ${data.stockAlerts.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {loading ? '-' : data.stockAlerts.length}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Branch Performance Chart (Simplified as List) */}
        <div className="card bg-white border-none shadow-xl shadow-slate-200/40">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 capitalize">Branch performance</h3>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-xl"></div>)
            ) : data.performance.length > 0 ? (
              data.performance.map((perf: any, idx: number) => {
                const maxVal = Math.max(...data.performance.map((p: any) => p._sum.totalAmount));
                const percentage = (perf._sum.totalAmount / maxVal) * 100;
                
                return (
                  <div key={perf.branchId} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-slate-700">Branch {perf.branchId.slice(-4).toUpperCase()}</span>
                      </div>
                      <span className="font-black text-slate-900 text-sm">₱{perf._sum.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-primary' : 'bg-slate-300'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-10 text-slate-400">No operational data recorded yet.</div>
            )}
          </div>
        </div>

        {/* Real-time Alerts */}
        <div className="space-y-6">
          <div className="card bg-slate-900 text-white border-none">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest !mb-0">Supply Health</h3>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="h-20 bg-slate-800 animate-pulse rounded-xl"></div>
              ) : data.stockAlerts.length > 0 ? (
                data.stockAlerts.slice(0, 3).map((alert: any) => (
                  <div key={alert.id} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-slate-100">{alert.ingredient.name}</span>
                      <span className="text-[10px] font-black bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full uppercase">Critical</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{alert.quantity} {alert.ingredient.unit} left at {alert.branch.name}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center py-6 text-slate-500">
                  <ChefHat className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-xs font-medium">All systems stocked</p>
                </div>
              )}
            </div>
            
            {data.stockAlerts.length > 3 && (
              <button className="w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                +{data.stockAlerts.length - 3} more alerts
              </button>
            )}
          </div>

          <div className="card bg-white border-slate-200 border-dashed hover:border-primary transition-colors cursor-pointer group">
            <div className="flex items-center justify-center h-20">
              <div className="text-center">
                <div className="inline-block p-2 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-2 group-hover:text-primary transition-colors">Generate Profit Report</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .card {
          @apply p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300;
        }
        .card:hover {
          @apply shadow-lg shadow-slate-200/50 -translate-y-1;
        }
        .stats-grid {
          @apply grid grid-cols-1 md:grid-cols-3 gap-6;
        }
        /* Custom Tailwind for animations if not configured */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-in { animation: fadeIn forwards; }
      `}</style>
    </div>
  );
}
