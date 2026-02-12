'use client';

import { useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function MenuCard({ item }) {
    const { addToCart } = useCart();
    const [selectedVariant, setSelectedVariant] = useState(item.variants ? item.variants[0] : null);

    const ref = useRef(null);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleAddToCart = () => {
        const itemToAdd = {
            ...item,
            variant: selectedVariant ? selectedVariant.name : null,
            price: selectedVariant ? selectedVariant.price : item.price,
        };
        addToCart(itemToAdd);
    };

    const currentPrice = selectedVariant ? selectedVariant.price : item.price;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-lg overflow-hidden transition-colors hover:border-neonBlue/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        >
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neonBlue/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none transform translate-z-[-10px]"></div>

            <div style={{ transform: "translateZ(20px)" }}>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white font-mono group-hover:text-neonBlue transition-colors">{item.name}</h3>
                    {item.category === 'Pizza' && <div className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">Hot</div>}
                </div>
                <p className="text-gray-400 text-sm mt-1 mb-4">{item.category}</p>
            </div>

            <div className="mt-auto relative z-10" style={{ transform: "translateZ(30px)" }}>
                {item.variants && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {item.variants.map((variant) => (
                            <button
                                key={variant.name}
                                onClick={() => setSelectedVariant(variant)}
                                className={`px-3 py-1 text-xs rounded-lg border transition-all ${selectedVariant?.name === variant.name
                                        ? 'bg-neonBlue text-black border-neonBlue font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                                        : 'bg-black/20 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {variant.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center mt-2">
                    <span className="text-2xl font-bold text-white tracking-tight">₹{currentPrice}</span>
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center gap-2 bg-white/5 hover:bg-neonBlue hover:text-black text-neonBlue border border-neonBlue/30 rounded-xl px-4 py-2 transition-all active:scale-95 group/btn shadow-lg"
                    >
                        <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
                        <span className="font-bold">Add</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
