'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Store, 
  AlertTriangle, 
  ArrowUpRight, 
  Package, 
  CreditCard,
  ChefHat,
  ArrowDownRight,
  Activity,
  Layers
} from 'lucide-react';
import { RBACGate } from '@/components/auth/rbac-gate';

import { useUser } from '@/context/user-context';
import { useApi } from '@/hooks/use-api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
        const hasAccess = permissions.includes('access:dashboard') || permissions.includes('tenant:admin');
        
        if (!hasAccess) {
            const role = user.role.name;
            if (role === 'Chef') router.push('/kitchen');
            else router.push('/pos');
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
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-12 max-w-xl w-full text-center space-y-6 border-rose-100/50 bg-rose-50/10"
            >
                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex-center mx-auto">
                    <AlertTriangle className="w-10 h-10 text-rose-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-main">Feature Restricted</h2>
                    <p className="text-muted font-medium">{apiError}</p>
                </div>
                <div className="pt-4">
                    <button 
                        onClick={() => router.push('/settings/billing')}
                        className="btn-minimal btn-accent px-8 hover-glow"
                    >
                        View Upgrade Options
                    </button>
                </div>
            </motion.div>
        </div>
      </RBACGate>
    )
  }

  return (
    <RBACGate permission="access:dashboard" redirectOnFail="/pos">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          <motion.div variants={item} className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-main leading-tight tracking-tight">
                <span className="text-gradient">Operational</span> Intelligence
              </h1>
              <p className="text-muted font-medium mt-1">
                Real-time oversight across <span className="text-main font-bold">{data.performance.length} branches</span>.
              </p>
            </div>
            <div className="flex gap-3">
               <div className="glass-card px-4 py-2 flex items-center gap-2 border-emerald-500/20 bg-emerald-500/5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Live System</span>
               </div>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="stats-grid">
            <motion.div variants={item} className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={80} />
              </div>
              <div className="flex-between">
                 <div className="p-3 bg-blue-500/10 rounded-lg">
                   <CreditCard className="w-6 h-6 text-blue-500" />
                 </div>
                 <div className="flex items-center gap-1 text-emerald-500 text-xs font-black bg-emerald-500/10 px-2 py-1 rounded-full">
                    <ArrowUpRight size={14} />
                    <span>12.5%</span>
                 </div>
              </div>
              <div>
                <h3 className="text-muted text-xs font-bold uppercase tracking-widest">Total Revenue</h3>
                <div className="text-3xl font-black text-main mt-1 tracking-tight">
                  {apiLoading ? <span className="opacity-20">₱0,000</span> : `₱${data.sales.toLocaleString()}`}
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Store size={80} />
              </div>
               <div className="p-3 bg-purple-500/10 rounded-lg self-start">
                  <Store className="w-6 h-6 text-purple-500" />
               </div>
               <div>
                  <h3 className="text-muted text-xs font-bold uppercase tracking-widest">Network Nodes</h3>
                  <div className="text-3xl font-black text-main mt-1 tracking-tight">
                    {apiLoading ? '-' : data.performance.length} <span className="text-sm font-medium text-muted">Branches</span>
                  </div>
               </div>
            </motion.div>

            <motion.div variants={item} className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Layers size={80} />
              </div>
               <div className={`p-3 rounded-lg self-start ${data.stockAlerts.length > 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}>
                  <AlertTriangle className={`w-6 h-6 ${data.stockAlerts.length > 0 ? 'text-rose-600' : 'text-emerald-500'}`} />
               </div>
               <div>
                  <h3 className="text-muted text-xs font-bold uppercase tracking-widest">Inventory Health</h3>
                  <div className={`text-3xl font-black mt-1 tracking-tight ${data.stockAlerts.length > 0 ? 'text-rose-600' : 'text-main'}`}>
                    {apiLoading ? '-' : data.stockAlerts.length} <span className="text-sm font-medium text-muted">Alerts</span>
                  </div>
               </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Branch Performance */}
            <motion.div variants={item} className="glass-card p-8 space-y-6">
              <div className="flex-between">
                <h2 className="text-xl font-black text-main uppercase tracking-tight">Branch Performance</h2>
                <button className="text-[10px] font-black uppercase text-accent hover:underline">View Report</button>
              </div>
              <div className="space-y-4">
                {data.performance.length === 0 && !apiLoading && (
                  <div className="py-12 text-center text-muted font-medium italic">No performance data available yet.</div>
                )}
                {data.performance.map((p, i) => (
                  <div key={p.branchId} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-surface flex-center font-black text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                      #{i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex-between mb-1">
                        <span className="text-sm font-bold text-main">Branch ID: {p.branchId.slice(-4)}</span>
                        <span className="text-xs font-black text-main">₱{p._sum.totalAmount?.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(p._sum.totalAmount / data.sales) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Critical Stock */}
            <motion.div variants={item} className="glass-card p-8 space-y-6">
               <div className="flex-between">
                <h2 className="text-xl font-black text-main uppercase tracking-tight">Supply Chain Risk</h2>
                <AlertTriangle size={18} className={data.stockAlerts.length > 0 ? 'text-rose-500' : 'text-muted'} />
              </div>
              <div className="space-y-3">
                {data.stockAlerts.length === 0 && !apiLoading && (
                   <div className="py-12 text-center space-y-2">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex-center mx-auto">
                        <Activity className="text-emerald-500" size={20} />
                      </div>
                      <p className="text-muted font-medium italic">All branches fully stocked.</p>
                   </div>
                )}
                {data.stockAlerts.slice(0, 5).map((stock) => (
                  <div key={stock.id} className="flex-between p-4 bg-surface/50 rounded-xl border border-transparent hover:border-rose-500/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex-center">
                        <Package size={14} className="text-rose-600" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-main uppercase">{stock.ingredient.name}</div>
                        <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{stock.branch.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs font-black text-rose-600">{stock.quantity} {stock.ingredient.unit}</div>
                       <div className="text-[9px] font-bold text-muted uppercase">Critical Level</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
        <style jsx>{`
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
            @media (max-width: 1024px) {
              .stats-grid { grid-template-columns: 1fr; }
            }
        `}</style>
    </RBACGate>
  );
}
