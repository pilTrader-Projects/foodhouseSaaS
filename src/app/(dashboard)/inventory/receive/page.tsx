'use client';

import { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Trash2, Save, ShoppingCart, Truck, PlusCircle, Loader2 } from 'lucide-react';
import { Badge, Button, Card, Modal } from '@/components/ui';
import { useUser } from '@/context/user-context';
import { useApi } from '@/hooks/use-api';

interface Supplier { id: string; name: string; }
interface Ingredient { id: string; name: string; unit: string; }
interface DeliveryItem { ingredientId: string; quantity: number; unitCost: number; }

export default function ReceiveDelivery() {
    const { user, loading: authLoading } = useUser();
    const { request, loading: apiLoading, error } = useApi();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<string>('');
    const [items, setItems] = useState<DeliveryItem[]>([{ ingredientId: '', quantity: 1, unitCost: 0 }]);
    const [isSaving, setIsSaving] = useState(false);

    // Quick Add States
    const [showSuppModal, setShowSuppModal] = useState(false);
    const [showIngModal, setShowIngModal] = useState(false);
    const [newSuppData, setNewSuppData] = useState({ name: '', contact: '' });
    const [newIngData, setNewIngData] = useState({ name: '', unit: '' });
    const [isCreating, setIsCreating] = useState(false);

    const fetchCatalogs = useCallback(async () => {
        try {
            const [suppData, ingData] = await Promise.all([
                request('/api/procurement/suppliers'),
                request('/api/inventory/ingredients')
            ]);
            setSuppliers(Array.isArray(suppData) ? suppData : []);
            setIngredients(Array.isArray(ingData) ? ingData : []);
        } catch (e) {
            console.error("Failed to load catalogs", e);
        }
    }, [request]);

    useEffect(() => {
        fetchCatalogs();
    }, [fetchCatalogs]);

    const handleQuickAddSupplier = async () => {
        if (!newSuppData.name) return;
        setIsCreating(true);
        try {
            const created = await request('/api/procurement/suppliers', {
                method: 'POST',
                body: JSON.stringify(newSuppData)
            });
            setSelectedSupplier(created.id);
            setShowSuppModal(false);
            setNewSuppData({ name: '', contact: '' });
            fetchCatalogs();
        } catch (e) {
            console.error("Creation failed", e);
        } finally {
            setIsCreating(false);
        }
    };

    const handleQuickAddIngredient = async () => {
        if (!newIngData.name || !newIngData.unit) return;
        setIsCreating(true);
        try {
            await request('/api/inventory/ingredients', {
                method: 'POST',
                body: JSON.stringify(newIngData)
            });
            setShowIngModal(false);
            setNewIngData({ name: '', unit: '' });
            fetchCatalogs();
        } catch (e) {
             console.error("Creation failed", e);
        } finally {
            setIsCreating(false);
        }
    };

    const addItem = () => setItems([...items, { ingredientId: '', quantity: 1, unitCost: 0 }]);
    const removeItem = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));
    const updateItem = (index: number, field: keyof DeliveryItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

    const handleSubmit = async () => {
        if (!selectedSupplier || !user?.branchId) return;
        setIsSaving(true);
        try {
            await request('/api/procurement/delivery', {
                method: 'POST',
                headers: { 'x-branch-id': user.branchId },
                body: JSON.stringify({ supplierId: selectedSupplier, items })
            });
            setItems([{ ingredientId: '', quantity: 1, unitCost: 0 }]);
            setSelectedSupplier('');
            alert("Delivery Recorded Successfully");
        } catch (e) {
            console.error("Submission error", e);
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return (
          <div className="h-[60vh] flex-col flex-center text-slate-400">
            <Loader2 className="w-12 h-12 rounded-full animate-spin mb-4 text-blue-600" />
            <p className="font-black tracking-widest uppercase text-xs text-slate-900">Syncing Procurement...</p>
          </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-8 rounded-sm border border-slate-100 shadow-sm">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <Truck className="w-10 h-10 text-accent" />
                        <span className="text-gradient">Receive</span> Delivery
                    </h1>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Incoming Inventory & Procurement Control</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 px-6 py-3 rounded-md flex items-center gap-4 text-white">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Value</p>
                            <p className="text-xl font-black">₱{totalCost.toLocaleString()}</p>
                        </div>
                        <ShoppingCart className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-sm border border-rose-100">
                    Error: {error}
                </div>
            )}

            <Card className="p-0 overflow-hidden border-none shadow-none">
                <div className="p-8 bg-slate-50 border-b border-slate-100">
                    <div className="flex justify-between items-center pr-4">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-blue-600" />
                            Supplier Information
                        </h3>
                        <Button variant="outline" size="xs" icon={PlusCircle} onClick={() => setShowSuppModal(true)}>Quick Add Supplier</Button>
                    </div>
                    <div className="mt-6">
                        <select 
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                            className="w-full h-16 px-6 bg-white border border-slate-200 rounded-md font-black text-slate-800 focus:border-blue-600 transition-all outline-none"
                        >
                            <option value="">Select Supplier...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-900">Delivery Line Items</h3>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowIngModal(true)} icon={PlusCircle} size="xs">Quick Add Item</Button>
                            <Button variant="outline" onClick={addItem} icon={Plus} size="xs">Add Line</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Ingredient</label>
                                    <select 
                                        value={item.ingredientId}
                                        onChange={(e) => updateItem(index, 'ingredientId', e.target.value)}
                                        className="w-full h-14 px-4 bg-slate-50 border border-slate-100 rounded-md font-bold text-slate-800 outline-none focus:border-blue-200 transition-all"
                                    >
                                        <option value="">Choose item...</option>
                                        {ingredients.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                                    </select>
                                </div>
                                <div className="w-32">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Qty</label>
                                    <input 
                                        type="number" 
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                        className="w-full h-14 px-4 bg-slate-50 border border-slate-100 rounded-md font-black text-center text-slate-900 outline-none focus:border-blue-200 transition-all"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Unit Cost</label>
                                    <input 
                                        type="number" 
                                        value={item.unitCost}
                                        onChange={(e) => updateItem(index, 'unitCost', parseFloat(e.target.value))}
                                        className="w-full h-14 px-4 bg-slate-50 border border-slate-100 rounded-md font-black text-center text-slate-900 outline-none focus:border-blue-200 transition-all"
                                    />
                                </div>
                                <button 
                                    onClick={() => removeItem(index)}
                                    className="h-14 w-12 flex-center text-slate-300 hover:text-rose-500 transition-colors"
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
                        disabled={!selectedSupplier || isSaving || apiLoading}
                        loading={isSaving || apiLoading}
                        onClick={handleSubmit}
                        className="h-16 px-12"
                    >
                        Confirm Receipt
                    </Button>
                </div>
            </Card>

            <Modal 
                isOpen={showSuppModal} 
                onClose={() => setShowSuppModal(false)}
                title="Quick Add Supplier"
                subtitle="Register a new vendor instantly"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                        <input 
                            className="w-full h-14 px-4 bg-slate-50 border border-slate-100 rounded-md font-bold"
                            value={newSuppData.name}
                            onChange={e => setNewSuppData({ ...newSuppData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Details</label>
                        <input 
                            className="w-full h-14 px-4 bg-slate-50 border border-slate-100 rounded-md font-bold"
                            value={newSuppData.contact}
                            onChange={e => setNewSuppData({ ...newSuppData, contact: e.target.value })}
                        />
                    </div>
                    <Button className="w-full h-16" onClick={handleQuickAddSupplier} loading={isCreating} icon={PlusCircle}>Create Supplier</Button>
                </div>
            </Modal>

            <Modal 
                isOpen={showIngModal} 
                onClose={() => setShowIngModal(false)}
                title="Quick Add Ingredient"
                subtitle="New raw material specification"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Item Name</label>
                        <input 
                            className="w-full h-14 px-4 bg-slate-50 border border-slate-100 rounded-md font-bold"
                            value={newIngData.name}
                            onChange={e => setNewIngData({ ...newIngData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unit (e.g. KG, PCS, LITER)</label>
                        <input 
                            className="w-full h-14 px-4 bg-slate-50 border border-slate-100 rounded-md font-bold"
                            value={newIngData.unit}
                            onChange={e => setNewIngData({ ...newIngData, unit: e.target.value })}
                        />
                    </div>
                    <Button className="w-full h-16" onClick={handleQuickAddIngredient} loading={isCreating} icon={PlusCircle}>Register Item</Button>
                </div>
            </Modal>
        </div>
    );
}
