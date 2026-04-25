'use client';

import { useState, useEffect } from 'react';
import { DEMO_PRODUCTS, DEMO_INGREDIENTS, INITIAL_STOCK, DEMO_BRANCH } from '@/lib/demo-data';

export default function PosTerminalPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [stock, setStock] = useState<Record<string, number>>(INITIAL_STOCK);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    
    // Quantity Modal State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [quantityInput, setQuantityInput] = useState(1);

    useEffect(() => {
        const savedMenu = localStorage.getItem('demo_menu');
        if (savedMenu) {
            setProducts(JSON.parse(savedMenu));
        } else {
            setProducts(DEMO_PRODUCTS);
        }
    }, []);

    const openQuantityModal = (product: any) => {
        setSelectedProduct(product);
        setQuantityInput(1);
    };

    const confirmAddToCart = () => {
        if (selectedProduct && quantityInput > 0) {
            setCart([...cart, { 
                ...selectedProduct, 
                quantity: quantityInput,
                displayPrice: selectedProduct.price * quantityInput,
                cartId: Math.random() 
            }]);
            setSelectedProduct(null);
        }
    };

    const removeFromCart = (cartId: number) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const total = cart.reduce((sum, item) => sum + item.displayPrice, 0);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        
        setTimeout(() => {
            const newStock = { ...stock };
            
            cart.forEach(item => {
                // If the product has a recipe, deduct based on quantity
                if (item.recipe) {
                    item.recipe.forEach((ingredient: any) => {
                        newStock[ingredient.ingredientId] -= (ingredient.amount * item.quantity);
                    });
                }
            });

            setStock(newStock);
            setCart([]);
            setIsCheckingOut(false);
            alert("Order Successful! Inventory updated.");
        }, 800);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', height: 'calc(100vh - 150px)', position: 'relative' }}>
            
            {/* Quantity Modal Overlay */}
            {selectedProduct && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 100, borderRadius: '1rem'
                }}>
                    <div className="card" style={{ width: '300px', textAlign: 'center' }}>
                        <h3>{selectedProduct.name}</h3>
                        <p style={{ margin: '1rem 0' }}>Enter Quantity:</p>
                        <input 
                            type="number" 
                            min="1"
                            value={quantityInput}
                            onChange={(e) => setQuantityInput(parseInt(e.target.value) || 1)}
                            style={{ 
                                width: '100%', padding: '1rem', fontSize: '1.5rem', 
                                textAlign: 'center', marginBottom: '1.5rem', borderRadius: '0.5rem',
                                border: '1px solid var(--border)'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button 
                                onClick={() => setSelectedProduct(null)}
                                style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border)', background: 'white', borderRadius: '0.5rem', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmAddToCart}
                                style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left: Product Grid & Inventory */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem' }}>Menu: {DEMO_BRANCH.name}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {products.map(product => (
                            <div key={product.id} className="card" style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.1s' }} onClick={() => openQuantityModal(product)}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍔</div>
                                <strong>{product.name}</strong>
                                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₱{product.price.toFixed(2)}</p>
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
                            <span>
                                {item.name} 
                                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>x{item.quantity}</span>
                            </span>
                            <div>
                                <strong>₱{item.displayPrice.toFixed(2)}</strong>
                                <button onClick={() => removeFromCart(item.cartId)} style={{ marginLeft: '0.5rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        <span>Total</span>
                        <span>₱{total.toFixed(2)}</span>
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
