'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import SpinWheel from '@/components/SpinWheel';
import FeedbackModal from '@/components/FeedbackModal';

export default function Cart() {
    const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [showSpinWheel, setShowSpinWheel] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [lastOrderId, setLastOrderId] = useState(null);
    const [wonPrize, setWonPrize] = useState(null);

    const handleCheckout = async () => {
        if (!customerName.trim()) {
            alert('Please enter your name');
            return;
        }

        setLoading(true);

        try {
            if (total > 100 && !wonPrize) {
                setLoading(false);
                setShowSpinWheel(true);
                return;
            }

            await placeOrder();

        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    const placeOrder = async (prize = wonPrize) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([
                    {
                        customer_name: customerName,
                        items: cart,
                        total: total,
                        status: 'pending',
                        items: prize ? [...cart, { name: `🏆 Prize: ${prize}`, price: 0, quantity: 1, id: 'prize' }] : cart
                    }
                ])
                .select();

            if (error) throw error;

            const orderId = data[0].id;
            setLastOrderId(orderId);

            clearCart();
            setIsOpen(false);
            setWonPrize(null);

            // Show feedback modal after small delay
            setTimeout(() => setShowFeedback(true), 2000);

            alert('Order Placed! ' + (prize ? `Prize: ${prize} added!` : ''));
        } catch (error) {
            console.error('Error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleSpinWin = async (prize) => {
        setWonPrize(prize);
    };

    const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={cartQuantity > 0 ? {
                    scale: [1, 1.1, 1],
                    boxShadow: ["0 0 0px rgba(255,153,0,0)", "0 0 20px rgba(255,153,0,0.5)", "0 0 0px rgba(255,153,0,0)"]
                } : {}}
                transition={{ duration: 0.5 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-neonOrange to-orange-600 text-black p-4 rounded-full shadow-lg z-40 flex items-center justify-center border border-white/10"
            >
                <ShoppingCart size={24} />
                {cartQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-neonBlue text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-black shadow-md">
                        {cartQuantity}
                    </span>
                )}
            </motion.button>

            {showSpinWheel && (
                <SpinWheel
                    onWin={handleSpinWin}
                    onClose={() => {
                        setShowSpinWheel(false);
                        if (wonPrize || total > 100) {
                            placeOrder(wonPrize);
                        }
                    }}
                />
            )}

            {showFeedback && (
                <FeedbackModal
                    isOpen={showFeedback}
                    onClose={() => setShowFeedback(false)}
                    orderId={lastOrderId}
                />
            )}

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1a1c22]/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col shadow-2xl"
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-xl font-bold font-mono text-neonBlue">Your Cart</h2>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-20 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                            <ShoppingCart size={40} className="opacity-30" />
                                        </div>
                                        <p>Your cart is empty</p>
                                        <button onClick={() => setIsOpen(false)} className="mt-4 text-neonBlue text-sm hover:underline">
                                            Go to Menu
                                        </button>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={item.id + item.variant}
                                            className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white">{item.name}</h4>
                                                {item.variant && <span className="text-xs text-neonOrange border border-neonOrange/30 px-1 rounded bg-neonOrange/5">{item.variant}</span>}
                                                <div className="text-sm text-gray-400 mt-1">₹{item.price * item.quantity}</div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center bg-black/40 rounded-lg border border-white/5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.variant, -1)}
                                                        className="px-3 py-1 text-neonBlue hover:bg-white/5 disabled:opacity-50 transition-colors"
                                                    >-</button>
                                                    <span className="text-sm font-mono w-6 text-center text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.variant, 1)}
                                                        className="px-3 py-1 text-neonBlue hover:bg-white/5 transition-colors"
                                                    >+</button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.variant)}
                                                    className="text-gray-500 p-2 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 border-t border-white/10 bg-black/40">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg text-gray-400">Total Bill</span>
                                        <span className="text-3xl font-bold font-mono text-white">₹{total}</span>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-4 text-white placeholder-gray-500 focus:border-neonBlue focus:bg-black/60 focus:outline-none transition-all"
                                    />

                                    <button
                                        onClick={handleCheckout}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-neonBlue to-cyan-600 text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {loading ? <Loader2 className="animate-spin text-black" /> : (
                                            <>
                                                {total > 100 ? 'Checkout & Spin!' : 'Place Order'}
                                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
