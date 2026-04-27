'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Save, ShoppingCart, Truck, Search } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { usePermissions } from '@/hooks/usePermissions';

interface Supplier {
    id: string;
    name: string;
}

interface Ingredient {
    id: string;
    name: string;
    unit: string;
}

interface DeliveryItem {
    ingredientId: string;
    quantity: number;
    unitCost: number;
}

export default function ReceiveDelivery() {
    const { branchId, loading: authLoading } = usePermissions();
    const { toast } = useToast();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<string>('');
    const [items, setItems] = useState<DeliveryItem[]>([{ ingredientId: '', quantity: 1, unitCost: 0 }]);
    const [isSaving, setIsSaving] = useState(false);

    const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || 'tenant-demo' : 'tenant-demo';

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [suppRes, ingRes] = await Promise.all([
                    fetch('/api/procurement/suppliers', { headers: { 'x-tenant-id': tenantId } }),
                    fetch('/api/inventory/ingredients', { headers: { 'x-tenant-id': tenantId } })
                ]);
                const [suppData, ingData] = await Promise.all([suppRes.json(), ingRes.json()]);
                setSuppliers(Array.isArray(suppData) ? suppData : []);
                setIngredients(Array.isArray(ingData) ? ingData : []);
            } catch (e) {
                toast("Failed to load catalogs", "error");
            }
        };
        fetchCatalogs();
    }, [tenantId]);

    const addItem = () => {
        setItems([...items, { ingredientId: '', quantity: 1, unitCost: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof DeliveryItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

    const handleSubmit = async () => {
        if (!selectedSupplier) return toast("Select a supplier", "error");
        if (items.some(i => !i.ingredientId || i.quantity <= 0)) return toast("Check item details", "error");

        setIsSaving(true);
        try {
            const res = await fetch('/api/procurement/delivery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': tenantId,
                    'x-branch-id': branchId!
                },
                body: JSON.stringify({ supplierId: selectedSupplier, items })
            });

            if (res.ok) {
                toast("Delivery recorded successfully", "success");
                setItems([{ ingredientId: '', quantity: 1, unitCost: 0 }]);
                setSelectedSupplier('');
            } else {
                const err = await res.json();
                toast(err.error || "Failed to record", "error");
            }
        } catch (e) {
            toast("Connection failure", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-8 rounded-4xl border-2 border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Package className="w-10 h-10 text-blue-600" />
                        Receive Delivery
                    </h1>
                    <p className="text-10 font-black text-slate-400 uppercase tracking-widest mt-1">Incoming Inventory & Procurement Control</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 px-6 py-3 rounded-2xl flex items-center gap-4 text-white">
                        <div className="text-right">
                            <p className="text-10 font-black text-slate-500 uppercase tracking-widest">Total Value</p>
                            <p className="text-xl font-black">${totalCost.toLocaleString()}</p>
                        </div>
                        <ShoppingCart className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            </div>

            <Card className="p-0 overflow-hidden border-none shadow-none">
                <div className="p-8 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-blue-600" />
                        Supplier Information
                    </h3>
                    <div className="mt-6">
                        <select 
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                            className="w-full h-16 px-6 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-800 appearance-none focus:border-blue-600 transition-all outline-none"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'3\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1.25rem' }}
                        >
                            <option value="">Select Supplier...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center pr-12">
                        <h3 className="text-lg font-black text-slate-900">Delivery Line Items</h3>
                        <Button variant="outline" onClick={addItem} icon={Plus} size="xs">Add Item</Button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-4 items-end animate-in slide-in-from-right-4 duration-300">
                                <div className="flex-1">
                                    <label className="block text-10 font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Ingredient</label>
                                    <select 
                                        value={item.ingredientId}
                                        onChange={(e) => updateItem(index, 'ingredientId', e.target.value)}
                                        className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-200 transition-all"
                                    >
                                        <option value="">Choose item...</option>
                                        {ingredients.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                                    </select>
                                </div>
                                <div className="w-32">
                                    <label className="block text-10 font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Qty</label>
                                    <input 
                                        type="number" 
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                        className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-center text-slate-900 outline-none focus:border-blue-200 transition-all"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="block text-10 font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Unit Cost</label>
                                    <input 
                                        type="number" 
                                        value={item.unitCost}
                                        onChange={(e) => updateItem(index, 'unitCost', parseFloat(e.target.value))}
                                        className="w-full h-14 px-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-center text-slate-900 outline-none focus:border-blue-200 transition-all"
                                    />
                                </div>
                                <button 
                                    onClick={() => removeItem(index)}
                                    className="h-14 w-12 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors"
                                    disabled={items.length === 1}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-slate-50 flex justify-end">
                    <Button 
                        variant="primary"
                        icon={Save}
                        disabled={!selectedSupplier || isSaving}
                        loading={isSaving}
                        onClick={handleSubmit}
                        style={{ height: '4rem', paddingLeft: '3rem', paddingRight: '3rem' }}
                    >
                        Confirm Receipt
                    </Button>
                </div>
            </Card>
        </div>
    );
}
