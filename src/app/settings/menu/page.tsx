'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings2, 
  Zap,
  ChefHat,
  Loader2
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { Badge, Button, Card } from '@/components/ui';
import { useToast } from '@/components/ui/toast';

export default function MenuManagementPage() {
  const { branchId, loading: authLoading } = usePermissions();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || 'tenant-demo' : 'tenant-demo';

  const fetchProducts = async () => {
    if (!branchId) return;
    try {
      const res = await fetch('/api/products', {
        headers: { 
          'x-tenant-id': tenantId,
          'x-branch-id': branchId
        }
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      toast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && branchId) fetchProducts();
  }, [branchId, authLoading]);

  const updateDeductionModel = async (productId: string, model: string, batchSize: number) => {
    setSavingId(productId);
    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
                'x-branch-id': branchId! 
            },
            body: JSON.stringify({ productId, deductionModel: model, batchSize }),
        });

        if (res.ok) {
            toast(`${model === 'ON_PRODUCTION' ? 'Batch Processing' : 'Standard'} strategy active`, "success");
            fetchProducts();
        } else {
            const err = await res.json();
            toast(err.error, "error");
        }
    } catch (e) {
        toast("Connection failure", "error");
    } finally {
        setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin mb-4" />
        <p className="font-black tracking-widest uppercase text-xs text-slate-900">Syncing Menu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings2 className="w-10 h-10 text-blue-600" />
            Menu Management
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure Catalog & Production Strategies</p>
        </div>
        <Button variant="dark" icon={Plus}>Add New Item</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="relative group overflow-hidden border-2 border-slate-50 hover:border-blue-100 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${product.deductionModel === 'ON_PRODUCTION' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-500'}`}>
                {product.deductionModel === 'ON_PRODUCTION' ? <ChefHat className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              </div>
              <Badge variant={product.deductionModel === 'ON_PRODUCTION' ? 'info' : 'warning'} size="xs">
                {product.deductionModel === 'ON_PRODUCTION' ? 'Batch Tracked' : 'On Demand'}
              </Badge>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-900 truncate">{product.name}</h3>
              <p className="text-2xl font-black text-blue-600 mt-1">₱{product.price.toLocaleString()}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Deduction Method</label>
                <div className="flex gap-2">
                  <Button 
                    variant={product.deductionModel === 'ON_ORDER' ? 'dark' : 'secondary'}
                    className="flex-1 h-10 px-2 text-[9px]"
                    onClick={() => updateDeductionModel(product.id, 'ON_ORDER', product.batchSize)}
                    loading={savingId === product.id && product.deductionModel !== 'ON_ORDER'}
                  >
                    Direct
                  </Button>
                  <Button 
                    variant={product.deductionModel === 'ON_PRODUCTION' ? 'dark' : 'secondary'}
                    className="flex-1 h-10 px-2 text-[9px]"
                    onClick={() => updateDeductionModel(product.id, 'ON_PRODUCTION', product.batchSize || 30)}
                    loading={savingId === product.id && product.deductionModel !== 'ON_PRODUCTION'}
                  >
                    Batched
                  </Button>
                </div>
              </div>

              {product.deductionModel === 'ON_PRODUCTION' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Pieces Per Batch</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number"
                      defaultValue={product.batchSize || 30}
                      onBlur={(e) => updateDeductionModel(product.id, 'ON_PRODUCTION', parseInt(e.target.value))}
                      className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 w-full font-black text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                    <p className="text-[10px] font-bold text-slate-400">PCS</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
