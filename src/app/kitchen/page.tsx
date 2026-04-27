'use client';

import { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  AlertCircle,
  Loader2,
  Tally4
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

export default function KitchenPage() {
  const { branchId, loading: authLoading } = usePermissions();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || 'tenant-demo' : 'tenant-demo';

  const fetchOrders = async () => {
    if (!branchId) return;
    try {
      const res = await fetch('/api/kitchen/orders', {
        headers: { 
          'x-tenant-id': tenantId,
          'x-branch-id': branchId
        }
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error("KDS Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, [branchId, authLoading]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/kitchen/orders', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
          'x-branch-id': branchId!
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (res.ok) {
        // Optimistic UI update or wait for next poll
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (e) {
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getTimeElapsed = (createdAt: string) => {
    const start = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - start) / 1000 / 60);
    return diff;
  };

  if (loading && !orders.length) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4 opacity-20" />
        <p className="font-bold tracking-widest uppercase text-xs">Syncing Kitchen Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ChefHat className="w-10 h-10 text-blue-600" />
            Kitchen Display
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 pl-1">
            Real-time Order Fulfillment • Branch: {branchId?.split('-').pop()}
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl shadow-slate-900/20">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active</p>
              <p className="text-xl font-black leading-none">{orders.length}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Tally4 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.map((order) => {
          const elapsed = getTimeElapsed(order.createdAt);
          const isLate = elapsed > 15;
          const isPreparing = order.status === 'PREPARING';
          const isReady = order.status === 'READY';

          return (
            <div 
              key={order.id} 
              className={`relative flex flex-col bg-white rounded-[2rem] border-2 transition-all duration-300 ${isReady ? 'border-green-500 shadow-xl shadow-green-500/10' : isLate ? 'border-rose-500 animate-pulse' : isPreparing ? 'border-blue-500' : 'border-slate-200'}`}
            >
              {/* Header */}
              <div className={`p-5 rounded-t-[1.8rem] flex justify-between items-start ${isReady ? 'bg-green-50' : isLate ? 'bg-rose-50' : isPreparing ? 'bg-blue-50' : 'bg-slate-50'}`}>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-none">ORDER #{order.id.slice(-4).toUpperCase()}</h3>
                  <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{order.user?.name || 'POS'}</p>
                </div>
                <div className={`flex flex-col items-end ${isLate ? 'text-rose-600' : 'text-slate-500'}`}>
                  <div className="flex items-center gap-1.5 font-black text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {elapsed}m
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 flex-1 space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-black text-slate-800 leading-tight">{item.product.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Standard Prep</p>
                    </div>
                    <span className="bg-slate-900 text-white text-xs font-black min-w-[24px] h-6 flex items-center justify-center rounded-lg shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-slate-50/30 rounded-b-[1.8rem] border-t border-slate-100">
                {updatingId === order.id ? (
                  <div className="w-full h-14 flex items-center justify-center text-slate-400 font-black text-xs uppercase tracking-widest">
                    Updating...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'PREPARING')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                      >
                        <PlayCircle className="w-5 h-5 fill-white/20" />
                        Start Prep
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'READY')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white h-14 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5 fill-white/20" />
                        Mark as Ready
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'COMPLETED')}
                        className="w-full bg-slate-900 hover:bg-black text-white h-14 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        Served & Clear
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Status Ribbon */}
              <div className={`absolute -top-3 -right-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${isReady ? 'bg-green-500 text-white' : isPreparing ? 'bg-blue-500 text-white shadow-blue-500/30' : 'bg-slate-100 text-slate-500'}`}>
                {order.status}
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="p-24 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest">Kitchen is Clean</h2>
          <p className="text-slate-400 font-bold mt-2">No active orders found for this branch.</p>
        </div>
      )}

      <style jsx global>{`
        .animate-in { animation: fadeIn 0.5s forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
