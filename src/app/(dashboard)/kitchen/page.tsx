'use client';

import { useState, useEffect } from 'react';
import { 
  ChefHat, 
  PlayCircle, 
  CheckCircle2,
  Tally4,
  RefreshCw,
  LayoutDashboard
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { Badge, Button, Card } from '@/components/ui';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function KitchenPage() {
  const { branchId, loading: authLoading } = usePermissions();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Production Entry State
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [prodQty, setProdQty] = useState(1);
  const [prodProductId, setProdProductId] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [productionLoading, setProductionLoading] = useState(false);

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

  const fetchProductionProducts = async () => {
    if (!branchId) return;
    try {
        const res = await fetch('/api/products', {
            headers: { 
                'x-tenant-id': tenantId,
                'x-branch-id': branchId
            }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
            setAvailableProducts(data.filter((p: any) => p.deductionModel === 'ON_PRODUCTION'));
        }
    } catch (e) {
        toast("Failed to load production list", "error");
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchOrders();
    fetchProductionProducts();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [branchId, authLoading]);

  const handleRecordProduction = async () => {
    if (!prodProductId || !branchId) return;
    setProductionLoading(true);
    try {
        const res = await fetch('/api/kitchen/production', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
                'x-branch-id': branchId 
            },
            body: JSON.stringify({ productId: prodProductId, quantity: prodQty }),
        });

        if (res.ok) {
            setShowProductionModal(false);
            const product = availableProducts.find(p => p.id === prodProductId);
            const totalYield = prodQty * (product?.batchSize || 1);
            toast(`Logged ${prodQty} batch(es). Yield: ${totalYield} units.`, "success");
            setProdQty(1);
            fetchOrders();
        } else {
            const err = await res.json();
            toast(err.error, "error");
        }
    } catch (e) {
        toast("Connection error", "error");
    } finally {
        setProductionLoading(false);
    }
  };

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
        toast(`Order updated to ${status}`, "info");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (e) {
      toast("Update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && !orders.length) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mb-4" />
        <p className="font-black tracking-widest uppercase text-xs">Syncing Kitchen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-4xl border-2 border-slate-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-10 h-10 text-blue-600" />
            Kitchen Display
          </h1>
          <p className="text-10 font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Order & Production Control</p>
        </div>
        
        <div className="flex gap-4">
          <Button onClick={() => setShowProductionModal(true)} icon={PlayCircle}>Produce Batch</Button>
          <div className="bg-slate-900 px-6 py-3 rounded-2xl flex items-center gap-4 text-white">
            <div className="text-right">
              <p className="text-10 font-black text-slate-500 uppercase tracking-widest">Active</p>
              <p className="text-xl font-black">{orders.length}</p>
            </div>
            <Tally4 className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 group-hover:bg-blue-600 transition-colors" style={{ height: '6px', position: 'absolute', top: 0, left: 0, right: 0 }} />
            
            <div className="flex justify-between items-start mb-6" style={{ marginTop: '0.5rem' }}>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-none">#{order.id.slice(-4).toUpperCase()}</h3>
                <p className="text-10 font-black text-slate-400 mt-1 uppercase tracking-widest">{order.user?.name || 'POS SESSION'}</p>
              </div>
              <Badge variant={order.status === 'READY' ? 'success' : order.status === 'PREPARING' ? 'info' : 'default'} size="xs">
                {order.status}
              </Badge>
            </div>

            <div className="space-y-3 mb-8">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <span className="font-black text-slate-800 text-sm">{item.product.name}</span>
                  <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-xs text-slate-900 shadow-sm">{item.quantity}</span>
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
      </div>

      <Modal 
        isOpen={showProductionModal} 
        onClose={() => setShowProductionModal(false)}
        title="Production Entry"
        subtitle="Log batch cooking for standardized tracking"
      >
        {!availableProducts.length ? (
          <div className="text-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200" style={{ padding: '3rem' }}>
            <p className="font-black text-slate-400">No batch products found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3">
              {availableProducts.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setProdProductId(p.id)}
                  className="p-4 rounded-2xl border-2 text-left transition-all"
                  style={{ 
                    backgroundColor: prodProductId === p.id ? '#eff6ff' : 'white', 
                    borderColor: prodProductId === p.id ? '#2563eb' : '#f1f5f9',
                    color: prodProductId === p.id ? '#2563eb' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  <p className="font-black text-slate-800 text-sm">{p.name}</p>
                  <p className="text-9 font-black text-slate-400 uppercase mt-1">Yield: {p.batchSize} / BATCH</p>
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-10 font-black text-slate-400 uppercase tracking-widest mb-4">Number of Batches</p>
              <div className="flex items-center justify-center gap-8">
                <button onClick={() => setProdQty(q => Math.max(1, q - 1))} className="bg-slate-100 flex items-center justify-center font-black" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', border: 'none', fontSize: '1.25rem' }}>-</button>
                <span className="text-6xl font-black text-slate-900">{prodQty}</span>
                <button onClick={() => setProdQty(q => q + 1)} className="bg-slate-900 text-white flex items-center justify-center font-black" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', border: 'none', fontSize: '1.25rem' }}>+</button>
              </div>
              {prodProductId && (
                <p className="text-xs font-black text-blue-600 uppercase mt-6 tracking-widest">
                  Total Yield: {prodQty * (availableProducts.find(p => p.id === prodProductId)?.batchSize || 0)} Units
                </p>
              )}
            </div>

            <Button 
              variant="dark"
              style={{ width: '100%', height: '5rem' }} 
              onClick={handleRecordProduction} 
              loading={productionLoading} 
              disabled={!prodProductId} 
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
