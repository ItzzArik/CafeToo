'use client';

import { useState, useMemo } from 'react';
import { menuItems } from '@/lib/menuData';
import MenuCard from '@/components/MenuCard';
import Cart from '@/components/Cart';
import SpinWheel from '@/components/SpinWheel';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', ...new Set(menuItems.map(item => item.category))];

export default function MenuPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showSpinWheel, setShowSpinWheel] = useState(false);

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    return (
        <main className="min-h-screen pb-24 relative overflow-hidden bg-darkBg">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neonBlue/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neonOrange/5 rounded-full blur-[100px]"></div>
            </div>

            <header className="sticky top-0 z-30 bg-darkBg/80 backdrop-blur-xl border-b border-white/5 p-4">
                <div className="max-w-5xl mx-auto flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ArrowLeft size={24} className="text-white" />
                            </Link>
                            <h1 className="text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-neonOrange">
                                Menu
                            </h1>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search for cravings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-neonBlue focus:outline-none transition-all text-white placeholder-gray-600 focus:bg-black/40"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${selectedCategory === category
                                        ? 'bg-neonBlue text-black border-neonBlue shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                                        : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredItems.map(item => (
                    <MenuCard key={item.id} item={item} />
                ))}
            </motion.div>

            <Cart onOrderSuccess={() => setShowSpinWheel(true)} />

            {showSpinWheel && (
                <SpinWheel onClose={() => setShowSpinWheel(false)} />
            )}
        </main>
    );
}
