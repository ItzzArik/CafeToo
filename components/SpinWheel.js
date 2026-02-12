'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';

const PRIZES = [
    'Free Extra Cheese',
    '₹5 Cashback',
    'Better Luck Next Time',
    '20% Off Next Order',
    'Free Topping',
    'High Five!',
];

export default function SpinWheel({ onClose, onWin }) {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);

    const spin = () => {
        if (spinning || result) return;
        setSpinning(true);

        // Random rotation between 5 and 10 full spins + random segment
        const randomDegree = 1800 + Math.floor(Math.random() * 360);
        const duration = 5; // seconds

        setTimeout(() => {
            setSpinning(false);
            const wonPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
            setResult(wonPrize);

            if (wonPrize !== 'Better Luck Next Time' && wonPrize !== 'High Five!') {
                onWin(wonPrize);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#00f3ff', '#ff9900', '#ffffff']
                });
            } else {
                // Sad confetti
            }
        }, duration * 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1c22] border border-neonOrange rounded-2xl p-6 text-center max-w-sm w-full relative shadow-[0_0_50px_rgba(255,153,0,0.2)]"
            >
                {!result && (
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                )}

                <h2 className="text-2xl font-bold text-neonOrange mb-6 font-mono text-transparent bg-clip-text bg-gradient-to-r from-neonOrange to-yellow-500">
                    Spin-to-Sip!
                </h2>

                <div className="relative w-64 h-64 mx-auto mb-6">
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-4 h-8 bg-white border-2 border-neonOrange shadow-lg" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>

                    <motion.div
                        className="w-full h-full rounded-full border-4 border-neonOrange relative overflow-hidden shadow-inner"
                        animate={{ rotate: spinning ? 1800 + Math.random() * 360 : 0 }}
                        transition={{ duration: 5, ease: "circOut" }}
                        style={{ backgroundImage: 'conic-gradient(from 0deg, #ff9900 0deg 60deg, #1a1a1a 60deg 120deg, #00f3ff 120deg 180deg, #1a1a1a 180deg 240deg, #ff9900 240deg 300deg, #00f3ff 300deg 360deg)' }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-[#1a1c22] rounded-full z-10 flex items-center justify-center font-bold text-white shadow-xl">
                                CafeToo
                            </div>
                        </div>
                    </motion.div>
                </div>

                {result ? (
                    <div className="space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.2 }}
                            className="text-2xl font-bold text-white mb-2"
                        >
                            {result}!
                        </motion.div>
                        <p className="text-sm text-gray-400">
                            {result !== 'Better Luck Next Time'
                                ? 'Applied to your order metadata.'
                                : 'Try again next time!'}
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gradient-to-r from-neonBlue to-cyan-600 text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={spin}
                        disabled={spinning}
                        className="px-8 py-3 bg-gradient-to-r from-neonOrange to-orange-600 text-black font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,153,0,0.4)] hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {spinning ? 'Good Luck...' : 'SPIN NOW'}
                    </button>
                )}
            </motion.div>
        </div>
    );
}
