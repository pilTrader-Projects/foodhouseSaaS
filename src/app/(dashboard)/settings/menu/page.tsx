'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings2, 
  Zap,
  ChefHat,
  Loader2
} from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useApi } from '@/hooks/use-api';
import { RBACGate } from '@/components/auth/rbac-gate';

export default function MenuManagementPage() {
  return (
    <RBACGate permission="access:menu" redirectOnFail="/dashboard">
      <MenuManagementContent />
    </RBACGate>
  );
}

function MenuManagementContent() {
  const { user } = useUser();
  const { request, loading: apiLoading, error } = useApi();
  const [products, setProducts] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!user?.branchId) return;
    try {
      const data = await request(`/api/products?branchId=${user.branchId}`);
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (user?.branchId) fetchProducts();
  }, [user?.branchId]);

  const updateDeductionModel = async (productId: string, model: string, batchSize: number) => {
    setSavingId(productId);
    try {
        await request('/api/products', {
            method: 'PATCH',
            body: JSON.stringify({ productId, deductionModel: model, batchSize }),
        });
        fetchProducts();
    } catch (e) {
        console.error("Update failure", e);
    } finally {
        setSavingId(null);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-[60vh] flex-col flex-center text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
        <p className="font-black tracking-widest uppercase text-xs text-slate-900">Syncing Menu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-8 rounded-sm border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings2 className="w-10 h-10 text-blue-600" />
            Menu Management
          </h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Configure Catalog & Production Strategies</p>
        </div>
        <button className="btn-minimal btn-accent flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Item
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-sm border border-rose-100">
            Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card-minimal flex flex-col group overflow-hidden border-2 border-slate-50 hover:border-blue-100 transition-all p-6">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${product.deductionModel === 'ON_PRODUCTION' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-500'}`}>
                {product.deductionModel === 'ON_PRODUCTION' ? <ChefHat className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${product.deductionModel === 'ON_PRODUCTION' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                {product.deductionModel === 'ON_PRODUCTION' ? 'Batch Tracked' : 'On Demand'}
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-900 truncate">{product.name}</h3>
              <p className="text-2xl font-black text-blue-600 mt-1">₱{product.price.toLocaleString()}</p>
            </div>

            <div className="mt-auto space-y-4 border-t border-slate-50 pt-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Deduction Method</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateDeductionModel(product.id, 'ON_ORDER', product.batchSize)}
                    className={`flex-1 h-10 text-[10px] font-black uppercase rounded-sm transition-all ${product.deductionModel === 'ON_ORDER' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    Direct
                  </button>
                  <button 
                    onClick={() => updateDeductionModel(product.id, 'ON_PRODUCTION', product.batchSize || 30)}
                    className={`flex-1 h-10 text-[10px] font-black uppercase rounded-sm transition-all ${product.deductionModel === 'ON_PRODUCTION' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    Batched
                  </button>
                </div>
              </div>

              {product.deductionModel === 'ON_PRODUCTION' && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Pieces Per Batch</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number"
                      defaultValue={product.batchSize || 30}
                      onBlur={(e) => updateDeductionModel(product.id, 'ON_PRODUCTION', parseInt(e.target.value))}
                      className="bg-white border border-slate-200 rounded-md px-4 py-2 w-full font-black text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                    <p className="text-[10px] font-bold text-slate-400">PCS</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {products.length === 0 && !initialLoading && (
            <div className="col-span-full p-20 text-center text-slate-400 text-xs font-black uppercase tracking-widest opacity-50">
                No catalog items found for this branch.
            </div>
        )}
      </div>
    </div>
  );
}
