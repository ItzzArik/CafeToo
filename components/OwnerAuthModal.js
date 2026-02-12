'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Check } from 'lucide-react';

export default function OwnerAuthModal({ isOpen, onClose }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for "remember me" token
        const token = localStorage.getItem('cafeToo_owner_token');
        if (token === 'enc_1234_secure_hash') {
            // Automatically redirect if token exists
            // We won't auto-redirect here to allow user to see the landing page, 
            // but if they click "Owner Portal" and token exists, we can skip modal?
            // For now, let's just pre-fill or auto-login if modal opens?
            // Better: logic should be on the button that opens this modal.
            // But for this component, let's just check on mount if isOpen is true
        }
    }, []);

    // Effect to auto-login if modal is opened and token exists
    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem('cafeToo_owner_token');
            if (token === 'enc_1234_secure_hash') {
                router.push('/owner');
                onClose();
            }
        }
    }, [isOpen, router, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin === '1234') {
            if (rememberMe) {
                localStorage.setItem('cafeToo_owner_token', 'enc_1234_secure_hash');
            }
            router.push('/owner');
            onClose();
        } else {
            setError(true);
            setTimeout(() => setError(false), 500);
            setPin('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-[#1a1c22] border border-white/10 w-full max-w-sm p-8 rounded-2xl shadow-2xl z-10"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center gap-6">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-neonOrange">
                                <Lock size={32} />
                            </div>

                            <div className="text-center">
                                <h2 className="text-2xl font-bold font-mono text-white mb-2">Owner Access</h2>
                                <p className="text-gray-400 text-sm">Enter your 4-digit security PIN</p>
                            </div>

                            <form onSubmit={handleSubmit} className="w-full">
                                <motion.div
                                    animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    <input
                                        type="password"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="• • • •"
                                        maxLength={4}
                                        autoFocus
                                        className={`w-full bg-black/30 text-center text-3xl tracking-[1em] font-mono py-4 rounded-xl border-2 focus:outline-none transition-colors ${error
                                                ? 'border-red-500 text-red-500 placeholder-red-500/50'
                                                : 'border-white/10 focus:border-neonOrange text-white'
                                            }`}
                                    />
                                </motion.div>

                                <div className="mt-4 flex items-center justify-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-neonBlue border-neonBlue' : 'border-gray-500'}`}>
                                        {rememberMe && <Check size={14} className="text-black" />}
                                    </div>
                                    <span className="text-sm text-gray-400 select-none">Remember Me</span>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-6 bg-neonOrange text-black font-bold py-3 rounded-xl hover:bg-orange-500 transition-colors"
                                >
                                    Unlock Dashboard
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
