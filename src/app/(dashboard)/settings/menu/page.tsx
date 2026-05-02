'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings2, 
  Zap,
  ChefHat,
  Loader2,
  Trash2,
  Package,
  ShoppingCart,
  PlusCircle,
  LayoutGrid
} from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useApi } from '@/hooks/use-api';
import { RBACGate } from '@/components/auth/rbac-gate';
import { Card, Badge, Modal, Button } from '@/components/ui';

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
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Add Product State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    deductionModel: 'ON_ORDER',
    batchSize: 1
  });

  // Recipe Management State
  const [activeRecipeProduct, setActiveRecipeProduct] = useState<any>(null);
  const [currentRecipe, setCurrentRecipe] = useState<any[]>([]);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

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

  const fetchIngredients = async () => {
    try {
        const data = await request('/api/inventory/ingredients');
        if (Array.isArray(data)) setIngredients(data);
    } catch (e) {
        console.error("Failed to load ingredients", e);
    }
  };

  useEffect(() => {
    if (user?.branchId) {
        fetchProducts();
        fetchIngredients();
    }
  }, [user?.branchId]);

  const openRecipeManager = async (product: any) => {
    setActiveRecipeProduct(product);
    try {
        const recipe = await request(`/api/products/${product.id}/recipe`);
        setCurrentRecipe(Array.isArray(recipe) ? recipe : []);
        setIsRecipeModalOpen(true);
    } catch (e) {
        console.error("Failed to load recipe", e);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await request('/api/products', {
            method: 'POST',
            body: JSON.stringify(newProduct),
        });
        setIsAddModalOpen(false);
        setNewProduct({ name: '', price: 0, deductionModel: 'ON_ORDER', batchSize: 1 });
        fetchProducts();
    } catch (e) {
        console.error("Creation failed", e);
    }
  };

  const handleSaveRecipe = async () => {
    if (!activeRecipeProduct) return;
    try {
        await request(`/api/products/${activeRecipeProduct.id}/recipe`, {
            method: 'POST',
            body: JSON.stringify({ 
                items: currentRecipe.map(r => ({
                    ingredientId: r.ingredientId,
                    amount: r.amount
                })) 
            }),
        });
        setIsRecipeModalOpen(false);
        alert("Recipe Saved Successfully");
    } catch (e) {
        console.error("Recipe Save Failed", e);
    }
  };

  const addRecipeItem = () => {
    setCurrentRecipe([...currentRecipe, { ingredientId: '', amount: 1 }]);
  };

  const removeRecipeItem = (index: number) => {
    setCurrentRecipe(currentRecipe.filter((_, i) => i !== index));
  };

  const updateRecipeItem = (index: number, field: string, value: any) => {
    const next = [...currentRecipe];
    next[index] = { ...next[index], [field]: value };
    setCurrentRecipe(next);
  };

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
    <div className="space-y-8 animate-fade-in text-slate-900">
      <div className="flex justify-between items-center bg-white p-8 rounded-sm border border-slate-100 shadow-sm">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <LayoutGrid className="w-10 h-10 text-accent" />
            <span className="text-gradient">Menu</span> Architecture
          </h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Configure Catalog & Production Strategies</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-minimal btn-accent flex items-center gap-2"
        >
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
              <Button 
                variant="outline" 
                className="w-full h-11 text-xs" 
                icon={Package} 
                onClick={() => openRecipeManager(product)}
              >
                Configure Recipe
              </Button>

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
      </div>

      {/* Add Product Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        subtitle="Specify product metadata and production strategy"
      >
        <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Product Name</label>
                <input 
                    required
                    type="text"
                    placeholder="e.g. Traditional Burger"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="input-minimal"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Base Selling Price</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₱</span>
                    <input 
                        required
                        type="number"
                        placeholder="0.00"
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        className="input-minimal pl-10"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Deduction Model</label>
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, deductionModel: 'ON_ORDER' })}
                        className={`flex-1 h-12 text-[10px] font-black uppercase rounded-sm transition-all ${newProduct.deductionModel === 'ON_ORDER' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                        On-Order (Direct)
                    </button>
                    <button 
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, deductionModel: 'ON_PRODUCTION' })}
                        className={`flex-1 h-12 text-[10px] font-black uppercase rounded-sm transition-all ${newProduct.deductionModel === 'ON_PRODUCTION' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                        On-Production (Batch)
                    </button>
                </div>
            </div>

            {newProduct.deductionModel === 'ON_PRODUCTION' && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-top-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Standard Batch Size (Units)</label>
                    <input 
                        required
                        type="number"
                        placeholder="30"
                        value={newProduct.batchSize}
                        onChange={(e) => setNewProduct({ ...newProduct, batchSize: parseInt(e.target.value) })}
                        className="input-minimal"
                    />
                </div>
            )}

            <Button 
                type="submit"
                variant="primary"
                className="w-full h-16 mt-4"
                loading={apiLoading}
                icon={Plus}
            >
                Confirm Specification
            </Button>
        </form>
      </Modal>

      {/* Recipe Management Modal */}
      <Modal 
        isOpen={isRecipeModalOpen} 
        onClose={() => setIsRecipeModalOpen(false)}
        title={`Recipe: ${activeRecipeProduct?.name}`}
        subtitle="Define quantity of ingredients consumed per item sold"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
            <div className="space-y-4">
                {currentRecipe.map((item, index) => (
                    <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-right-2">
                        <div className="flex-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Ingredient</label>
                            <select 
                                value={item.ingredientId}
                                onChange={(e) => updateRecipeItem(index, 'ingredientId', e.target.value)}
                                className="input-minimal"
                            >
                                <option value="">Select Item...</option>
                                {ingredients.map(ing => (
                                    <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-32">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Amount</label>
                            <input 
                                type="number"
                                step="0.01"
                                value={item.amount}
                                onChange={(e) => updateRecipeItem(index, 'amount', parseFloat(e.target.value))}
                                className="input-minimal text-center"
                            />
                        </div>
                        <button 
                            onClick={() => removeRecipeItem(index)}
                            className="bg-rose-50 text-rose-500 w-12 h-12 rounded-lg flex items-center justify-center hover:bg-rose-100 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {currentRecipe.length === 0 && (
                    <div className="p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="font-black text-slate-400 text-xs uppercase tracking-widest">No ingredients defined</p>
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-50">
                <Button variant="outline" className="flex-1" icon={PlusCircle} onClick={addRecipeItem}>Add Ingredient</Button>
                <Button variant="primary" className="flex-1" icon={ShoppingCart} onClick={handleSaveRecipe} loading={apiLoading}>Save Recipe</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
}
