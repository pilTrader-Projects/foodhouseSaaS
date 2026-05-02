'use client';

import { useState, useEffect, useCallback } from 'react';
import { Package, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Search, Truck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui';
import { useUser } from '@/context/user-context';
import { useApi } from '@/hooks/use-api';

interface StockItem {
    id: string;
    name: string;
    unit: string;
    currentStock: number;
    lastUpdated: string | null;
}

export default function InventoryDashboard() {
    const { user, loading: authLoading } = useUser();
    const { request, loading: apiLoading, error } = useApi();
    const [inventory, setInventory] = useState<StockItem[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProfile = useCallback(async () => {
        if (!user?.branchId) return;
        try {
            const data = await request(`/api/inventory/profile?branchId=${user.branchId}`);
            setInventory(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Failed to load inventory profile", e);
        } finally {
            setInitialLoading(false);
        }
    }, [user?.branchId, request]);

    useEffect(() => {
        if (user?.branchId) fetchProfile();
    }, [user?.branchId, fetchProfile]);

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

    if (authLoading || (initialLoading && !inventory.length)) {
        return (
          <div className="h-[60vh] flex-col flex-center text-slate-400">
            <Loader2 className="w-12 h-12 rounded-full animate-spin mb-4 text-blue-600" />
            <p className="font-black tracking-widest uppercase text-xs text-slate-900">Syncing Inventory...</p>
          </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="layout-card-header">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <Package className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                        <span className="text-gradient">Inventory</span> Profile
                    </h1>
                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Stock Monitoring & Control</p>
                </div>
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                    <Link href="/inventory/receive" className="flex-1 md:flex-none">
                        <Button variant="primary" icon={Truck} className="w-full justify-center">Receive Delivery</Button>
                    </Link>
                    <button 
                        onClick={fetchProfile}
                        disabled={apiLoading}
                        className="p-3 md:p-4 rounded-md bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all border border-transparent"
                    >
                        <RefreshCw className={`w-5 h-5 ${apiLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-sm border border-rose-100">
                    Error: {error}
                </div>
            )}

            {/* Quick Stats */}
            <div className="layout-grid layout-grid-3">
                <Card className="bg-white border-slate-100 p-4 md:p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Items</p>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900">{inventory.length}</h2>
                        </div>
                        <div className="p-2 md:p-3 bg-blue-50 rounded-lg text-blue-600">
                            <Package className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-slate-100 p-4 md:p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Low Stock</p>
                            <h2 className="text-3xl md:text-4xl font-black text-amber-600">{lowStockItems.length}</h2>
                        </div>
                        <div className="p-2 md:p-3 bg-amber-50 rounded-lg text-amber-600">
                            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>
                </Card>
                <Card className="bg-white border-slate-100 p-4 md:p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Out of Stock</p>
                            <h2 className="text-3xl md:text-4xl font-black text-rose-600">{outOfStockItems.length}</h2>
                        </div>
                        <div className="p-2 md:p-3 bg-rose-50 rounded-lg text-rose-600">
                            <XCircle className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* main Content Panel */}
            <Card title="Live Stock Tracking" subtitle="detailed breakdown of raw materials" className="p-0 overflow-hidden">
                <div className="p-4 md:p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Filter ingredients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-md font-bold text-slate-800 outline-none focus:border-blue-300 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingredient Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Level</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Movement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredItems.map((item) => {
                                const status = getStatus(item.currentStock);
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.id}</p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg font-black text-slate-900">
                                                {item.currentStock.toLocaleString()}
                                                <span className="text-[10px] text-slate-500 uppercase">{item.unit}</span>
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
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">
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
