'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ChefHat, 
  PlayCircle, 
  CheckCircle2,
  Tally4,
  LayoutDashboard,
  Flame,
  Loader2
} from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useApi } from '@/hooks/use-api';
import { Badge, Button, Card } from '@/components/ui';
import { Modal } from '@/components/ui/modal';

export default function KitchenPage() {
  const { user, loading: authLoading } = useUser();
  const { request, loading: apiLoading, error } = useApi();
  const [orders, setOrders] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Production Entry State
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [prodQty, setProdQty] = useState(1);
  const [prodProductId, setProdProductId] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [productionLoading, setProductionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.branchId) return;
    try {
      const data = await request(`/api/kitchen/orders?branchId=${user.branchId}`);
      setOrders(data.orders || []);
    } catch (e) {
      console.error("KDS Fetch Error:", e);
    } finally {
      setInitialLoading(false);
    }
  }, [user?.branchId, request]);

  const fetchProductionProducts = useCallback(async () => {
    if (!user?.branchId) return;
    try {
        const data = await request(`/api/products?branchId=${user.branchId}`);
        if (Array.isArray(data)) {
            setAvailableProducts(data.filter((p: any) => p.deductionModel === 'ON_PRODUCTION'));
        }
    } catch (e) {
        console.error("Failed to load production list", e);
    }
  }, [user?.branchId, request]);

  useEffect(() => {
    if (user?.branchId) {
        fetchOrders();
        fetchProductionProducts();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }
  }, [user?.branchId, fetchOrders, fetchProductionProducts]);

  const handleRecordProduction = async () => {
    if (!prodProductId || !user?.branchId) return;
    setProductionLoading(true);
    try {
        await request('/api/kitchen/production', {
            method: 'POST',
            headers: { 'x-branch-id': user.branchId },
            body: JSON.stringify({ productId: prodProductId, quantity: prodQty }),
        });

        setShowProductionModal(false);
        setProdQty(1);
        fetchOrders();
        alert("Production Logged Successfully");
    } catch (e) {
        console.error("Connection error", e);
    } finally {
        setProductionLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    if (!user?.branchId) return;
    setUpdatingId(orderId);
    try {
      await request('/api/kitchen/orders', {
        method: 'PATCH',
        headers: { 'x-branch-id': user.branchId },
        body: JSON.stringify({ orderId, status }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (e) {
      console.error("Update failed", e);
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || (initialLoading && !orders.length)) {
    return (
      <div className="h-[60vh] flex-col flex-center text-slate-400">
        <Loader2 className="w-12 h-12 rounded-full animate-spin mb-4 text-blue-600" />
        <p className="font-black tracking-widest uppercase text-xs text-slate-900">Syncing Kitchen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-8 rounded-sm border border-slate-100 shadow-sm">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Flame className="w-10 h-10 text-accent" />
            <span className="text-gradient">Kitchen</span> Display
          </h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Order & Production Control</p>
        </div>
        
        <div className="flex gap-4">
          <Button onClick={() => setShowProductionModal(true)} icon={PlayCircle}>Produce Batch</Button>
          <div className="bg-slate-900 px-6 py-3 rounded-md flex items-center gap-4 text-white">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active</p>
              <p className="text-xl font-black">{orders.length}</p>
            </div>
            <Tally4 className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-sm border border-rose-100">
            Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="relative group overflow-hidden p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-none">#{order.id.slice(-4).toUpperCase()}</h3>
                <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{order.user?.name || 'POS SESSION'}</p>
              </div>
              <Badge variant={order.status === 'READY' ? 'success' : order.status === 'PREPARING' ? 'info' : 'default'} size="xs">
                {order.status}
              </Badge>
            </div>

            <div className="space-y-3 mb-8">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                  <span className="font-black text-slate-800 text-sm">{item.product.name}</span>
                  <span className="w-8 h-8 rounded-md bg-white flex items-center justify-center font-black text-xs text-slate-900 shadow-sm">{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-50">
              {order.status === 'PENDING' && (
                <Button variant="primary" loading={updatingId === order.id} onClick={() => updateStatus(order.id, 'PREPARING')} icon={PlayCircle} style={{ width: '100%' }}>Start Prep</Button>
              )}
              {order.status === 'PREPARING' && (
                <Button variant="success" loading={updatingId === order.id} onClick={() => updateStatus(order.id, 'READY')} icon={CheckCircle2} style={{ width: '100%' }}>Mark Ready</Button>
              )}
              {order.status === 'READY' && (
                <Button variant="dark" loading={updatingId === order.id} onClick={() => updateStatus(order.id, 'COMPLETED')} icon={CheckCircle2} style={{ width: '100%' }}>Clear Order</Button>
              )}
            </div>
          </Card>
        ))}
        {orders.length === 0 && !initialLoading && (
            <div className="col-span-full p-20 text-center text-slate-400 text-xs font-black uppercase tracking-widest opacity-50">
                No active orders in queue.
            </div>
        )}
      </div>

      <Modal 
        isOpen={showProductionModal} 
        onClose={() => setShowProductionModal(false)}
        title="Production Entry"
        subtitle="Log batch cooking for standardized tracking"
      >
        {!availableProducts.length ? (
          <div className="text-center p-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No batch products found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3">
              {availableProducts.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setProdProductId(p.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${prodProductId === p.id ? 'bg-blue-50 border-blue-600' : 'bg-white border-slate-100'}`}
                >
                  <p className="font-black text-slate-800 text-sm">{p.name}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Yield: {p.batchSize} / BATCH</p>
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Number of Batches</p>
              <div className="flex items-center justify-center gap-8">
                <button onClick={() => setProdQty(q => Math.max(1, q - 1))} className="bg-slate-100 w-14 h-14 rounded-xl font-black text-xl hover:bg-slate-200 transition-all">-</button>
                <span className="text-6xl font-black text-slate-900">{prodQty}</span>
                <button onClick={() => setProdQty(q => q + 1)} className="bg-slate-900 text-white w-14 h-14 rounded-xl font-black text-xl hover:bg-slate-800 transition-all">+</button>
              </div>
              {prodProductId && (
                <p className="text-xs font-black text-blue-600 uppercase mt-6 tracking-widest">
                  Total Yield: {prodQty * (availableProducts.find(p => p.id === prodProductId)?.batchSize || 0)} Units
                </p>
              )}
            </div>

            <Button 
              variant="dark"
              className="w-full h-20"
              onClick={handleRecordProduction} 
              loading={productionLoading} 
              disabled={!prodProductId || productionLoading} 
              icon={PlayCircle}
            >
              Confirm Production
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
