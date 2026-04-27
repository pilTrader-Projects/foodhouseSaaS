'use client';

import { useState, useEffect } from 'react';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

export default function MenuManagementPage() {
    const [menu, setMenu] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [deductionModel, setDeductionModel] = useState('ON_ORDER');
    const [batchSize, setBatchSize] = useState('1');

    useEffect(() => {
        const tenantId = localStorage.getItem('tenantId') || 'tenant-demo';
        async function fetchMenu() {
            try {
                const res = await fetch('/api/products', {
                    headers: { 'x-tenant-id': tenantId }
                });
                const data = await res.json();
                if (res.ok) setMenu(data);
                else setMenu(DEMO_PRODUCTS);
            } catch (e) {
                setMenu(DEMO_PRODUCTS);
            }
        }
        fetchMenu();
    }, []);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const tenantId = localStorage.getItem('tenantId') || 'tenant-demo';

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-tenant-id': tenantId
                },
                body: JSON.stringify({ 
                    name, 
                    price: parseFloat(price),
                    deductionModel,
                    batchSize: parseFloat(batchSize)
                }),
            });

            if (res.ok) {
                const newItem = await res.json();
                setMenu([...menu, newItem]);
                setName('');
                setPrice('');
                setDeductionModel('ON_ORDER');
                setBatchSize('1');
            } else {
                alert("Failed to add item");
            }
        } catch (e) {
            alert("Connection error");
        }
    };

    const deleteItem = async (id: string) => {
        // Deletion not yet implemented in ProductService, but we simulate success for demo
        const updated = menu.filter(item => item.id !== id);
        setMenu(updated);
    };

    return (
        <div style={{ maxWidth: '900px' }}>
            <h1>Menu Management</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Define your store's products and their selling prices.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
                <div className="card">
                    <h3>Actual Menu Items</h3>
                    <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '0.75rem' }}>Product Name</th>
                                <th style={{ padding: '0.75rem' }}>Strategy & Yield</th>
                                <th style={{ padding: '0.75rem' }}>Price (PHP)</th>
                                <th style={{ padding: '0.75rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menu.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {item.id}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ 
                                                width: 'fit-content',
                                                padding: '2px 8px', 
                                                borderRadius: '999px', 
                                                fontSize: '10px', 
                                                fontWeight: 'bold',
                                                backgroundColor: item.deductionModel === 'ON_PRODUCTION' ? '#dcfce7' : '#f1f5f9',
                                                color: item.deductionModel === 'ON_PRODUCTION' ? '#166534' : '#64748b'
                                            }}>
                                                {item.deductionModel === 'ON_PRODUCTION' ? 'BATCH COOKED' : 'ON DEMAND'}
                                            </span>
                                            {item.deductionModel === 'ON_PRODUCTION' && (
                                                <div style={{ fontSize: '10px', color: '#166534', fontWeight: 'bold' }}>
                                                    Yield: {item.batchSize} units / batch
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>₱{item.price.toFixed(2)}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button 
                                            onClick={() => deleteItem(item.id)}
                                            style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h3>Add New Item</h3>
                    <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Item Name</label>
                            <input 
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Rice"
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Price (₱)</label>
                            <input 
                                required
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="0.00"
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Inventory Strategy</label>
                            <select 
                                value={deductionModel}
                                onChange={e => setDeductionModel(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: '0.4rem', border: '1px solid var(--border)', background: 'white' }}
                            >
                                <option value="ON_ORDER">On-Demand (Deduct ingredients at sale)</option>
                                <option value="ON_PRODUCTION">Batch-Cooked (Chef logs cooked items)</option>
                            </select>
                        </div>
                        
                        {deductionModel === 'ON_PRODUCTION' && (
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Units per Batch</label>
                                <input 
                                    required
                                    type="number"
                                    min="1"
                                    value={batchSize}
                                    onChange={e => setBatchSize(e.target.value)}
                                    placeholder="e.g. 100 for Rice"
                                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }}
                                />
                                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    How many individual units are produced in one standard batch?
                                </p>
                            </div>
                        )}

                        <button 
                            type="submit"
                            style={{ padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.4rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}
                        >
                            Add to Menu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
