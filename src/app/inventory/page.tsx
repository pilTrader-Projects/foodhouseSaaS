'use client';

import { useState, useEffect } from 'react';
import { Package, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Search, ArrowUpRight, Truck } from 'lucide-react';
import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui';
import { useToast } from '@/components/ui/toast';
import { usePermissions } from '@/hooks/usePermissions';

interface StockItem {
    id: string;
    name: string;
    unit: string;
    currentStock: number;
    lastUpdated: string | null;
}

export default function InventoryDashboard() {
    const { branchId, user, loading: authLoading } = usePermissions();
    const { toast } = useToast();
    const [inventory, setInventory] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || 'tenant-demo' : 'tenant-demo';

    const fetchProfile = async () => {
        if (!branchId) return;
        setLoading(true);
        try {
            const res = await fetch('/api/inventory/profile', {
                headers: {
                    'x-tenant-id': tenantId,
                    'x-branch-id': branchId
                }
            });
            const data = await res.json();
            setInventory(Array.isArray(data) ? data : []);
        } catch (e) {
            toast("Failed to load inventory profile", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && branchId) fetchProfile();
    }, [branchId, authLoading]);

    const filteredItems = inventory.filter(i => 
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockThreshold = 10;
    const lowStockItems = inventory.filter(i => i.currentStock > 0 && i.currentStock <= lowStockThreshold);
    const outOfStockItems = inventory.filter(i => i.currentStock <= 0);

    const getStatus = (qty: number) => {
        if (qty <= 0) return { label: 'Out of Stock', variant: 'danger' as any, icon: XCircle };
        if (qty <= lowStockThreshold) return { label: 'Low Stock', variant: 'warning' as any, icon: AlertTriangle };
        return { label: 'In Stock', variant: 'success' as any, icon: CheckCircle2 };
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-center bg-white p-8 rounded-4xl border-2 border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Package className="w-10 h-10 text-blue-600" />
                        Inventory Profile
                    </h1>
                    <p className="text-10 font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Stock Monitoring & Control</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/inventory/receive">
                        <Button variant="primary" icon={Truck}>Receive Delivery</Button>
                    </Link>
                    <button 
                        onClick={fetchProfile}
                        className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all border-2 border-transparent"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-10 font-black text-slate-400 uppercase tracking-widest mb-1">Total Items</p>
                            <h2 className="text-4xl font-black text-slate-900">{inventory.length}</h2>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-10 font-black text-slate-400 uppercase tracking-widest mb-1">Low Stock</p>
                            <h2 className="text-4xl font-black text-amber-600">{lowStockItems.length}</h2>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-10 font-black text-slate-400 uppercase tracking-widest mb-1">Out of Stock</p>
                            <h2 className="text-4xl font-black text-rose-600">{outOfStockItems.length}</h2>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                            <XCircle className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* main Content Panel */}
            <Card title="Live Stock Tracking" subtitle="detailed breakdown of raw materials" className="p-0 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Filter ingredients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-300 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-10 font-black text-slate-400 uppercase tracking-widest">Ingredient Name</th>
                                <th className="px-8 py-5 text-10 font-black text-slate-400 uppercase tracking-widest text-center">Current Level</th>
                                <th className="px-8 py-5 text-10 font-black text-slate-400 uppercase tracking-widest">Stock Status</th>
                                <th className="px-8 py-5 text-10 font-black text-slate-400 uppercase tracking-widest">Last Movement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredItems.map((item) => {
                                const status = getStatus(item.currentStock);
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                                            <p className="text-10 font-bold text-slate-400 uppercase tracking-wider">{item.id}</p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl font-black text-slate-900">
                                                {item.currentStock.toLocaleString()}
                                                <span className="text-10 text-slate-500 uppercase">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant={status.variant} className="flex items-center gap-2 w-fit">
                                                <status.icon className="w-3 h-3" />
                                                {status.label}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-600">
                                                {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'No recorded activity'}
                                            </p>
                                            <p className="text-10 font-bold text-slate-400 uppercase">
                                                {item.lastUpdated ? new Date(item.lastUpdated).toLocaleTimeString() : '-'}
                                            </p>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <Package className="w-12 h-12 opacity-20" />
                                            <p className="text-lg font-black uppercase tracking-widest">No inventory found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
