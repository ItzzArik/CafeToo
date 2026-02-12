'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, ChefHat, Bell, LogOut, ArrowRight, Zap, Send } from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboard() {
    const [orders, setOrders] = useState([]);
    const [flashMessage, setFlashMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .neq('status', 'completed');

            if (data) setOrders(data);
        };

        fetchOrders();

        const channel = supabase
            .channel('realtime orders')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
                setOrders((prev) => [payload.new, ...prev]);
                playSound();
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
                setOrders((prev) =>
                    payload.new.status === 'completed'
                        ? prev.filter(o => o.id !== payload.new.id)
                        : prev.map(o => o.id === payload.new.id ? payload.new : o)
                );
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed', e));
        }
    };

    const updateStatus = async (id, status) => {
        await supabase.from('orders').update({ status }).eq('id', id);
        if (status === 'completed') {
            setOrders(prev => prev.filter(o => o.id !== id));
        } else {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        }
    };

    const sendFlashOffer = async () => {
        if (!flashMessage.trim()) return;
        setIsSending(true);

        await supabase.from('offers').insert([{ message: flashMessage }]);

        setFlashMessage('');
        setIsSending(false);
        alert('Flash Offer Broadcasted!');
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const preparingOrders = orders.filter(o => o.status === 'accepted');

    return (
        <div className="min-h-screen bg-[#0f1115] text-white p-6 relative font-sans">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <header className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-white/5 relative z-10 gap-4">
                <div>
                    <h1 className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-neonOrange to-yellow-500">
                        Kitchen Display
                    </h1>
                    <p className="text-gray-400 text-sm">Live Service Dashboard</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Flash Deal Control */}
                    <div className="flex bg-black/40 rounded-full border border-white/10 p-1">
                        <input
                            type="text"
                            placeholder="Broadcast Flash Deal..."
                            value={flashMessage}
                            onChange={(e) => setFlashMessage(e.target.value)}
                            className="bg-transparent text-sm px-4 py-2 outline-none text-white placeholder-gray-500 w-48 md:w-64"
                        />
                        <button
                            onClick={sendFlashOffer}
                            disabled={isSending || !flashMessage}
                            className="bg-neonOrange text-black p-2 rounded-full hover:bg-orange-500 disabled:opacity-50 transition-colors"
                        >
                            {isSending ? <Clock size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>

                    <div className="bg-black/40 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-green-500">SYSTEM ONLINE</span>
                    </div>
                    <Link href="/" className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors">
                        <LogOut size={20} />
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

                {/* NEW ORDERS COLUMN */}
                <div className="bg-[#1a1c22]/50 border border-white/5 rounded-3xl p-6 flex flex-col h-[calc(100vh-180px)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-neonBlue">
                            <Bell className="animate-bounce" size={20} />
                            Incoming
                        </h2>
                        <span className="bg-neonBlue/10 text-neonBlue px-3 py-1 rounded-full text-xs font-bold">{pendingOrders.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none">
                        <AnimatePresence>
                            {pendingOrders.map(order => (
                                <OrderCard key={order.id} order={order} onAction={() => updateStatus(order.id, 'accepted')} actionLabel="Start Prep" actionColor="blue" />
                            ))}
                            {pendingOrders.length === 0 && <EmptyState message="Waiting for new orders..." icon={<Clock />} />}
                        </AnimatePresence>
                    </div>
                </div>

                {/* PREPARING COLUMN */}
                <div className="bg-[#1a1c22]/50 border border-white/5 rounded-3xl p-6 flex flex-col h-[calc(100vh-180px)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-neonOrange">
                            <ChefHat className="animate-pulse" size={20} />
                            In Progress
                        </h2>
                        <span className="bg-neonOrange/10 text-neonOrange px-3 py-1 rounded-full text-xs font-bold">{preparingOrders.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none">
                        <AnimatePresence>
                            {preparingOrders.map(order => (
                                <OrderCard key={order.id} order={order} onAction={() => updateStatus(order.id, 'completed')} actionLabel="Complete" actionColor="green" />
                            ))}
                            {preparingOrders.length === 0 && <EmptyState message="Kitchen is clear" icon={<ChefHat />} />}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}

function OrderCard({ order, onAction, actionLabel, actionColor }) {
    const isPrize = order.items.some(i => i.id === 'prize');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-black/40 border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-${actionColor === 'blue' ? 'neonBlue' : 'neonOrange'}/50 transition-colors`}
        >
            {isPrize && <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">WINNER</div>}

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">{order.customer_name}</h3>
                    <span className="text-xs text-gray-500 font-mono">#{order.id.slice(0, 4)}</span>
                </div>
                <div className="text-right">
                    <span className="block text-xl font-bold font-mono text-white">₹{order.total}</span>
                    <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 mb-4 space-y-2">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm items-center">
                        <span className={`text-gray-300 ${item.id === 'prize' ? 'text-yellow-400 font-bold' : ''}`}>
                            {item.quantity}x {item.name}
                        </span>
                        {item.variant && <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">{item.variant}</span>}
                    </div>
                ))}
            </div>

            <button
                onClick={onAction}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${actionColor === 'blue'
                        ? 'bg-neonBlue/10 text-neonBlue hover:bg-neonBlue hover:text-black'
                        : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black'
                    }`}
            >
                {actionLabel}
                <ArrowRight size={18} />
            </button>
        </motion.div>
    )
}

function EmptyState({ message, icon }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-gray-600 gap-4"
        >
            <div className="text-4xl opacity-20">{icon}</div>
            <p className="font-mono text-sm">{message}</p>
        </motion.div>
    )
}
