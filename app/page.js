'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Coffee, Utensils, Lock } from 'lucide-react';
import OwnerAuthModal from '@/components/OwnerAuthModal';

export default function LandingPage() {
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Parallax Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 100, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 100, damping: 30 });

    function handleMouseMove(event) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        x.set((clientX / innerWidth) - 0.5);
        y.set((clientY / innerHeight) - 0.5);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
    const translateX = useTransform(mouseX, [-0.5, 0.5], ["-20px", "20px"]);
    const translateY = useTransform(mouseY, [-0.5, 0.5], ["-20px", "20px"]);

    return (
        <main
            onMouseMove={handleMouseMove}
            className="min-h-screen relative overflow-hidden text-white flex flex-col items-center justify-center p-6"
        >
            <OwnerAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            {/* Header Logo with Glitch Effect */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 group cursor-default select-none">
                <div className="relative">
                    <h1 className="text-2xl font-black font-mono tracking-tighter text-white group-hover:animate-noise relative z-10">
                        CafeToo
                    </h1>
                    <h1 className="text-2xl font-black font-mono tracking-tighter text-neonBlue absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-[2px] transition-all">
                        CafeToo
                    </h1>
                    <h1 className="text-2xl font-black font-mono tracking-tighter text-neonOrange absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:-translate-x-[2px] transition-all">
                        CafeToo
                    </h1>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                <span className="text-xs font-bold text-green-500 tracking-widest text-[0.6rem] uppercase border border-green-500/30 px-1 rounded">Open</span>
            </div>

            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/10 rounded-full blur-[1px]"
                        style={{
                            width: Math.random() * 10 + 2 + 'px',
                            height: Math.random() * 10 + 2 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 15 + 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Hero Content */}
            <div className="z-10 flex flex-col items-center gap-8 max-w-md w-full text-center perspective-[1000px]">

                {/* Parallax Tea Cup */}
                <div className="relative mb-8 perspective-[1000px]">
                    <motion.div
                        style={{ rotateX, rotateY, translateX, translateY }}
                        className="w-40 h-40 bg-gradient-to-br from-neonOrange to-red-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,95,31,0.4)] relative z-10"
                    >
                        <Coffee size={80} className="text-black drop-shadow-2xl" />
                    </motion.div>

                    {/* Hot Steam Particles */}
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={`steam-${i}`}
                            className="absolute -top-10 left-1/2 w-3 h-10 bg-white/30 rounded-full blur-md"
                            initial={{ opacity: 0, y: 0, x: -10 }}
                            animate={{
                                opacity: [0, 0.5, 0],
                                y: -80,
                                x: i % 2 === 0 ? 15 : -15,
                                scale: [1, 1.5]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: i * 0.5,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-6xl font-black font-sans text-transparent bg-clip-text bg-gradient-to-r from-neonBlue via-white to-neonOrange mb-4 tracking-tight drop-shadow-sm"
                    >
                        Fuel Your Hustle.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-400 text-lg font-medium"
                    >
                        Engineering-Grade Snacks for Future Engineers.
                    </motion.p>
                </div>

                {/* Navigation Cards */}
                <div className="w-full grid grid-cols-1 gap-4 mt-8">
                    <Link href="/menu" className="group">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                            className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between cursor-pointer group-hover:border-neonBlue/50 transition-colors shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-neonBlue/20 rounded-xl text-neonBlue">
                                    <Utensils size={28} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-white group-hover:text-neonBlue transition-colors">Hungry Student</h3>
                                    <p className="text-sm text-gray-500">Order food & drinks</p>
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    <button onClick={() => setShowAuthModal(true)} className="group w-full text-left">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                            className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between cursor-pointer group-hover:border-neonOrange/50 transition-colors shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-neonOrange/20 rounded-xl text-neonOrange">
                                    <Lock size={28} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-white group-hover:text-neonOrange transition-colors">Owner Portal</h3>
                                    <p className="text-sm text-gray-500">Manage orders</p>
                                </div>
                            </div>
                        </motion.div>
                    </button>
                </div>

            </div>
        </main>
    );
}
