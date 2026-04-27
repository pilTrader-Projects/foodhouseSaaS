'use client';

import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  ShoppingBag, 
  CreditCard, 
  Banknote, 
  Trash2, 
  PlayCircle,
  CheckCircle2,
  Package
} from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function PosTerminalPage() {
    const { branchId, user, loading: authLoading } = usePermissions();
    const { toast } = useToast();
    const [cart, setCart] = useState<any[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    
    // Quantity Modal State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [quantityInput, setQuantityInput] = useState(1);

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentType, setPaymentType] = useState('Cash');
    const [amountTendered, setAmountTendered] = useState<string>('');
    const [change, setChange] = useState<number>(0);

    const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || 'tenant-demo' : 'tenant-demo';

    useEffect(() => {
        if (authLoading) return;
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products', {
                    headers: { 'x-tenant-id': tenantId, 'x-branch-id': branchId! }
                });
                const data = await res.json();
                if (res.ok) setProducts(Array.isArray(data) ? data : []);
            } catch (e) {
                toast("Failed to load products", "error");
            }
        }
        if (branchId) fetchProducts();
    }, [branchId, authLoading]);

    const confirmAddToCart = () => {
        if (selectedProduct && quantityInput > 0) {
            setCart([...cart, { 
                ...selectedProduct, 
                quantity: quantityInput,
                displayPrice: selectedProduct.price * quantityInput,
                cartId: Math.random() 
            }]);
            setSelectedProduct(null);
            toast(`${selectedProduct.name} added to cart`, "success");
        }
    };

    const removeFromCart = (cartId: number) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const total = cart.reduce((sum, item) => sum + item.displayPrice, 0);

    useEffect(() => {
        const tendered = parseFloat(amountTendered) || 0;
        setChange(tendered >= total ? tendered - total : 0);
    }, [amountTendered, total]);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-tenant-id': tenantId,
                    'x-branch-id': branchId!
                },
                body: JSON.stringify({
                    items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price }))
                }),
            });

            if (res.ok) {
                toast("Order Successful", "success");
                setCart([]);
                setShowPaymentModal(false);
                setAmountTendered('');
            } else {
                const error = await res.json();
                toast(error.error, "error");
            }
        } catch (e) {
            toast("Checkout failed", "error");
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg-grid-cols-3 gap-8" style={{ height: 'calc(100vh - 180px)' }}>
            
            {/* Left: Product Selection */}
            <div className="flex-1 space-y-6 overflow-y-auto" style={{ gridColumn: 'span 2' }}>
                <Card title="Product Menu" subtitle="Tap to add items to current order">
                    <div className="grid grid-cols-2 md-grid-cols-3 gap-4">
                        {products.map(product => (
                            <div 
                                key={product.id} 
                                onClick={() => setSelectedProduct(product)}
                                className="bg-slate-50 p-6 rounded-3xl border-2 border-transparent transition-all cursor-pointer text-center group"
                                style={{ border: '2px solid transparent' }}
                            >
                                <div className="text-3xl mb-3">🍔</div>
                                <p className="font-black text-slate-800 text-sm">{product.name}</p>
                                <p className="font-black text-blue-600 mt-1">₱{product.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Right: Cart & Summary */}
            <Card className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-6">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-black text-slate-900 uppercase">Cart</h3>
                    <Badge variant="dark" className="ml-auto">{cart.length}</Badge>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 mb-6">
                    {cart.map(item => (
                        <div key={item.cartId} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                            <div className="flex-1">
                                <p className="font-black text-slate-800 text-sm">{item.name}</p>
                                <p className="text-10 font-black text-slate-400 uppercase">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-900">₱{item.displayPrice.toLocaleString()}</p>
                                <button onClick={() => removeFromCart(item.cartId)} style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px' }}><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300" style={{ padding: '5rem 0' }}>
                            <Package className="w-12 h-12 mb-4" style={{ opacity: 0.2 }} />
                            <p className="font-black uppercase text-10 tracking-widest">Cart is Empty</p>
                        </div>
                    )}
                </div>

                <div className="border-t-2 border-dashed border-slate-50 pt-6 mt-auto">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-10 font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                        <span className="text-3xl font-black text-slate-900">₱{total.toLocaleString()}</span>
                    </div>
                    <Button variant="primary" style={{ width: '100%', height: '4rem', fontSize: '1.125rem' }} disabled={cart.length === 0} onClick={() => setShowPaymentModal(true)} icon={CreditCard}>
                        Checkout Order
                    </Button>
                </div>
            </Card>

            {/* Quantity Modal */}
            <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title="Select Quantity" subtitle={selectedProduct?.name}>
                <div className="text-center" style={{ padding: '1.5rem 0' }}>
                    <div className="flex items-center justify-center gap-8 mb-8">
                        <button onClick={() => setQuantityInput(q => Math.max(1, q - 1))} className="bg-slate-100 flex items-center justify-center font-black" style={{ width: '4rem', height: '4rem', borderRadius: '1rem', fontSize: '1.5rem', border: 'none' }}>-</button>
                        <span className="text-6xl font-black text-slate-900">{quantityInput}</span>
                        <button onClick={() => setQuantityInput(q => q + 1)} className="bg-slate-900 text-white flex items-center justify-center font-black" style={{ width: '4rem', height: '4rem', borderRadius: '1rem', fontSize: '1.5rem', border: 'none' }}>+</button>
                    </div>
                    <Button variant="primary" style={{ width: '100%', height: '4rem' }} onClick={confirmAddToCart}>Add to Cart • ₱{(selectedProduct?.price * quantityInput).toLocaleString()}</Button>
                </div>
            </Modal>

            {/* Payment Modal */}
            <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Complete Payment" subtitle={`Total Due: ₱${total.toLocaleString()}`}>
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setPaymentType('Cash')}
                            className="p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all"
                            style={{ 
                                backgroundColor: paymentType === 'Cash' ? '#eff6ff' : 'white', 
                                borderColor: paymentType === 'Cash' ? '#2563eb' : '#f1f5f9',
                                color: paymentType === 'Cash' ? '#2563eb' : '#94a3b8',
                                cursor: 'pointer'
                            }}
                        >
                            <Banknote className="w-8 h-8" />
                            <span className="font-black uppercase text-10 tracking-widest">Cash</span>
                        </button>
                        <button 
                            onClick={() => setPaymentType('Digital')}
                            className="p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all"
                            style={{ 
                                backgroundColor: paymentType === 'Digital' ? '#eff6ff' : 'white', 
                                borderColor: paymentType === 'Digital' ? '#2563eb' : '#f1f5f9',
                                color: paymentType === 'Digital' ? '#2563eb' : '#94a3b8',
                                cursor: 'pointer'
                            }}
                        >
                            <CreditCard className="w-8 h-8" />
                            <span className="font-black uppercase text-10 tracking-widest">Digital</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-10 font-black text-slate-400 uppercase tracking-widest pl-1">Amount Tendered</label>
                        <input 
                            type="number" autoFocus
                            placeholder="0.00"
                            value={amountTendered}
                            onChange={(e) => setAmountTendered(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100"
                            style={{ height: '5rem', borderRadius: '1.5rem', padding: '0 2rem', fontSize: '1.875rem', fontWeight: 900, outline: 'none' }}
                        />
                    </div>

                    {paymentType === 'Cash' && parseFloat(amountTendered) >= total && (
                        <div className="bg-green-50 p-6 rounded-3xl flex justify-between items-center" style={{ border: '1px solid #dcfce7' }}>
                            <span className="text-10 font-black text-green-600 uppercase tracking-widest">Change Due</span>
                            <span className="text-3xl font-black text-green-700">₱{change.toLocaleString()}</span>
                        </div>
                    )}

                    <Button 
                        variant="dark" 
                        style={{ width: '100%', height: '5rem', fontSize: '1.125rem' }} 
                        disabled={parseFloat(amountTendered) < total || isCheckingOut} 
                        onClick={handleCheckout} 
                        loading={isCheckingOut} icon={CheckCircle2}
                    >
                        Confirm Transaction
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
