'use client';

import { useState } from 'react';
import { DEMO_PRODUCTS, DEMO_INGREDIENTS, INITIAL_STOCK, DEMO_BRANCH } from '@/lib/demo-data';

export default function PosTerminalPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [stock, setStock] = useState<Record<string, number>>(INITIAL_STOCK);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const addToCart = (product: any) => {
        setCart([...cart, { ...product, cartId: Math.random() }]);
    };

    const removeFromCart = (cartId: number) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        
        // Simulation of the real backend transaction
        // In a real app, we'd call: fetch('/api/pos/checkout', { method: 'POST', body: ... })
        setTimeout(() => {
            const newStock = { ...stock };
            
            cart.forEach(item => {
                item.recipe.forEach((ingredient: any) => {
                    newStock[ingredient.ingredientId] -= ingredient.amount;
                });
            });

            setStock(newStock);
            setCart([]);
            setIsCheckingOut(false);
            alert("Order Successful! Inventory updated.");
        }, 800);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', height: 'calc(100vh - 150px)' }}>
            
            {/* Left: Product Grid & Inventory */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem' }}>Menu: {DEMO_BRANCH.name}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {DEMO_PRODUCTS.map(product => (
                            <div key={product.id} className="card" style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.1s' }} onClick={() => addToCart(product)}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍔</div>
                                <strong>{product.name}</strong>
                                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>Live Branch Inventory</h3>
                    <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '0.5rem' }}>Ingredient</th>
                                <th style={{ padding: '0.5rem' }}>Available Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DEMO_INGREDIENTS.map(ing => (
                                <tr key={ing.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.5rem' }}>{ing.name}</td>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold', color: stock[ing.id] < 2 ? 'var(--danger)' : 'inherit' }}>
                                        {stock[ing.id].toFixed(2)} {ing.unit}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right: Cart */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Current Order</h3>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
                    {cart.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Cart is empty</p>}
                    {cart.map(item => (
                        <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            <span>{item.name}</span>
                            <div>
                                <strong>${item.price.toFixed(2)}</strong>
                                <button onClick={() => removeFromCart(item.cartId)} style={{ marginLeft: '0.5rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isCheckingOut}
                        style={{ 
                            width: '100%', 
                            padding: '1rem', 
                            backgroundColor: 'var(--primary)', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '0.5rem', 
                            fontWeight: 'bold',
                            cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                            opacity: cart.length === 0 || isCheckingOut ? 0.6 : 1
                        }}
                    >
                        {isCheckingOut ? 'Processing...' : 'Complete Sale'}
                    </button>
                </div>
            </div>
        </div>
    );
}
