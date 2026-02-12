'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X } from 'lucide-react';

export default function FlashOffer() {
    const [offer, setOffer] = useState(null);

    useEffect(() => {
        const channel = supabase
            .channel('flash_offers')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'offers' }, (payload) => {
                if (payload.new.is_active) {
                    setOffer(payload.new);
                    // Auto hide after 15 seconds
                    setTimeout(() => setOffer(null), 15000);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <AnimatePresence>
            {offer && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4"
                >
                    <div className="bg-gradient-to-r from-neonOrange to-red-600 text-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(255,95,31,0.5)] flex items-center gap-4 max-w-lg w-full pointer-events-auto border border-white/20">
                        <div className="bg-black/20 p-2 rounded-full">
                            <Zap className="text-yellow-300 animate-pulse" size={24} fill="currentColor" />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-lg font-mono tracking-wide uppercase">Flash Deal!</h3>
                            <p className="text-sm font-medium opacity-90">{offer.message}</p>
                        </div>

                        <button
                            onClick={() => setOffer(null)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
