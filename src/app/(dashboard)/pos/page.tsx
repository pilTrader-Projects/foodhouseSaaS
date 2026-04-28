'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/user-context';
import { useApi } from '@/hooks/use-api';
import { 
  ShoppingBag, 
  CreditCard, 
  Banknote, 
  Trash2, 
  CheckCircle2,
  Package,
  Loader2
} from 'lucide-react';
import { Badge, Button, Card, Modal } from '@/components/ui';

export default function PosTerminalPage() {
    const { user, permissions, loading: authLoading } = useUser();
    const { request, loading: apiLoading, error: apiError } = useApi();
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

    const fetchProducts = useCallback(async () => {
        if (!user?.tenantId) return;
        try {
            const url = user.branchId
                ? `/api/products?branchId=${user.branchId}`
                : `/api/products`;
            const data = await request(url);
            if (Array.isArray(data)) setProducts(data);
        } catch (e) {
            console.error("Failed to load products", e);
        }
    }, [user?.tenantId, user?.branchId, request]);

    useEffect(() => {
        if (user?.tenantId) fetchProducts();
    }, [user?.tenantId, fetchProducts]);

    const confirmAddToCart = () => {
        if (selectedProduct && quantityInput > 0) {
            setCart([...cart, { 
                ...selectedProduct, 
                quantity: quantityInput,
                displayPrice: selectedProduct.price * quantityInput,
                cartId: Math.random() 
            }]);
            setSelectedProduct(null);
            setQuantityInput(1);
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
        if (!user?.tenantId) return;
        setIsCheckingOut(true);
        try {
            await request('/api/orders', {
                method: 'POST',
                headers: { 'x-branch-id': user.branchId },
                body: JSON.stringify({
                    items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price }))
                }),
            });

            setCart([]);
            setShowPaymentModal(false);
            setAmountTendered('');
            alert("Order Successful!");
        } catch (e) {
            console.error("Checkout failed", e);
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (authLoading || (apiLoading && products.length === 0)) {
        return (
            <div className="h-[60vh] flex-col flex-center text-slate-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                <p className="font-black tracking-widest uppercase text-xs text-slate-900">Syncing POS...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg-grid-cols-3 gap-8 h-screen-pos overflow-hidden">
            {/* Left: Product Selection (Independent Scroll) */}
            <div className="lg-col-span-2 h-full overflow-y-auto pr-2 custom-scrollbar">
                <Card title="Product Menu" subtitle="Tap to add items to current order" className="min-h-full">
                    {apiError && (
                        <div className="mb-4 text-xs font-black text-rose-600 uppercase tracking-widest p-4 bg-rose-50 rounded-sm">
                            {apiError}
                        </div>
                    )}
                    <div className="grid grid-cols-2 md-grid-cols-3 gap-4">
                        {products.map(product => (
                            <div 
                                key={product.id} 
                                onClick={() => {
                                    console.log("Product clicked:", product);
                                    setSelectedProduct(product);
                                    setQuantityInput(1);
                                }}
                                className="bg-slate-50 p-6 rounded-3xl border-2 border-transparent hover:border-blue-200 transition-all cursor-pointer text-center group"
                            >
                                <div className="text-3xl mb-3">🍔</div>
                                <p className="font-black text-slate-800 text-sm">{product.name}</p>
                                <p className="font-black text-blue-600 mt-1">₱{product.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Right: Cart & Summary (Fixed Height, Internal Scroll) */}
            <Card className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-6 flex-shrink-0">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-black text-slate-900 uppercase">Cart</h3>
                    <Badge variant="dark" className="ml-auto">{cart.length}</Badge>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-1 custom-scrollbar">
                    {cart.map(item => (
                        <div key={item.cartId} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                            <div className="flex-1">
                                <p className="font-black text-slate-800 text-sm">{item.name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-900">₱{item.displayPrice.toLocaleString()}</p>
                                <button onClick={() => removeFromCart(item.cartId)} className="text-rose-500 hover:text-rose-700 transition-all mt-1">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="h-full flex-col flex-center text-slate-300 py-20 grayscale opacity-50">
                            <Package className="w-12 h-12 mb-4" />
                            <p className="font-black uppercase text-[10px] tracking-widest">Cart is Empty</p>
                        </div>
                    )}
                </div>

                <div className="border-t border-dashed border-slate-200 pt-6 mt-auto flex-shrink-0">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                        <span className="text-3xl font-black text-slate-900">₱{total.toLocaleString()}</span>
                    </div>
                    <Button 
                        variant="primary" 
                        className="w-full h-16 text-lg" 
                        disabled={cart.length === 0} 
                        onClick={() => setShowPaymentModal(true)} 
                        icon={CreditCard}
                    >
                        Checkout Order
                    </Button>
                </div>
            </Card>

            {/* Quantity Modal */}
            <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title="Select Quantity" subtitle={selectedProduct?.name}>
                <div className="text-center py-6">
                    <div className="flex items-center justify-center gap-6 mb-10">
                        <button 
                            onClick={() => setQuantityInput(q => Math.max(1, q - 1))} 
                            className="bg-slate-100 w-20 h-20 rounded-3xl flex-center text-3xl font-black transition-all hover:bg-slate-200 active:scale-95"
                        >
                            -
                        </button>
                        
                        <input 
                            type="number"
                            autoFocus
                            value={quantityInput}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setQuantityInput(Math.max(1, parseInt(e.target.value) || 1))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    confirmAddToCart();
                                    setSelectedProduct(null); // Close modal on Enter
                                }
                            }}
                            className="w-32 text-center text-6xl font-black text-slate-900 bg-transparent border-none outline-none focus:ring-0"
                        />

                        <button 
                            onClick={() => setQuantityInput(q => q + 1)} 
                            className="bg-slate-900 text-white w-20 h-20 rounded-3xl flex-center text-3xl font-black transition-all hover:bg-slate-800 active:scale-95"
                        >
                            +
                        </button>
                    </div>
                    
                    <Button variant="primary" className="w-full h-20 text-xl" onClick={() => {
                        confirmAddToCart();
                        setSelectedProduct(null);
                    }}>
                        Add to Cart • ₱{(selectedProduct?.price * (quantityInput || 0)).toLocaleString()}
                    </Button>

                    
                    <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">
                        Press Enter to Confirm
                    </p>
                </div>
            </Modal>

            {/* Payment Modal */}
            <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Complete Payment" subtitle={`Total Due: ₱${total.toLocaleString()}`}>
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setPaymentType('Cash')}
                            className={`p-6 rounded-3xl border-2 flex-col flex-center gap-3 transition-all ${paymentType === 'Cash' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                            <Banknote className="w-8 h-8" />
                            <span className="font-black uppercase text-[10px] tracking-widest">Cash</span>
                        </button>
                        <button 
                            onClick={() => setPaymentType('Digital')}
                            className={`p-6 rounded-3xl border-2 flex-col flex-center gap-3 transition-all ${paymentType === 'Digital' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                            <CreditCard className="w-8 h-8" />
                            <span className="font-black uppercase text-[10px] tracking-widest">Digital</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Amount Tendered</label>
                        <input 
                            type="number" autoFocus
                            placeholder="0.00"
                            value={amountTendered}
                            onChange={(e) => setAmountTendered(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 h-20 rounded-3xl px-8 text-3xl font-black outline-none focus:border-blue-600 transition-all"
                        />
                    </div>

                    {paymentType === 'Cash' && parseFloat(amountTendered) >= total && (
                        <div className="bg-green-50 p-6 rounded-3xl flex justify-between items-center border border-green-200">
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Change Due</span>
                            <span className="text-3xl font-black text-green-700">₱{change.toLocaleString()}</span>
                        </div>
                    )}

                    <Button 
                        variant="dark" 
                        className="w-full h-20 text-lg" 
                        disabled={parseFloat(amountTendered) < total || isCheckingOut || apiLoading} 
                        onClick={handleCheckout} 
                        loading={isCheckingOut || apiLoading} icon={CheckCircle2}
                    >
                        Confirm Transaction
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
