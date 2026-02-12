'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

const MOODS = [
    { emoji: '🔥', label: 'Spicy', tag: 'Spicy' },
    { emoji: '😋', label: 'Tasty', tag: 'Tasty' },
    { emoji: '⚡', label: 'Fast', tag: 'Fast Service' },
    { emoji: '🤮', label: 'Bad', tag: 'Not Good' }, // Maybe too harsh? Let's use 👎
    { emoji: '👎', label: 'Bad', tag: 'Not Good' },
    { emoji: '🧊', label: 'Cold', tag: 'Cold Food' }
];

export default function FeedbackModal({ isOpen, onClose, orderId }) {
    const [rating, setRating] = useState(0);
    const [selectedTags, setSelectedTags] = useState([]);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) return alert('Please give a star rating');

        setIsSubmitting(true);

        try {
            await supabase.from('feedback').insert([{
                order_id: orderId, // Can be null if we don't track it strictly
                rating,
                comments: comment,
                tags: selectedTags
            }]);

            onClose();
            alert('Thanks for your feedback!');
        } catch (error) {
            console.error(error);
            alert('Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-[#1a1c22] border border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl z-10"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold font-mono text-center mb-2 text-white">Rate Your Meal</h2>
                        <p className="text-gray-400 text-center text-sm mb-6">How was the food?</p>

                        {/* Stars */}
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                                >
                                    <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>

                        {/* Moods */}
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                            {MOODS.map((mood) => (
                                <button
                                    key={mood.tag}
                                    onClick={() => toggleTag(mood.tag)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${selectedTags.includes(mood.tag)
                                            ? 'bg-neonBlue/20 border-neonBlue text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-xl">{mood.emoji}</span>
                                    <span className="text-xs font-bold">{mood.label}</span>
                                </button>
                            ))}
                        </div>

                        <textarea
                            placeholder="Any other comments?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-neonBlue focus:outline-none mb-6 h-24 resize-none"
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-neonBlue text-black font-bold py-3 rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
