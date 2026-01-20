"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface FloatingInputProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export default function FloatingInput({ onSend, isLoading, placeholder = "Digite sua mensagem..." }: FloatingInputProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky bottom-0 left-0 right-0 p-4 md:p-6"
        >
            <div className="max-w-4xl mx-auto">
                {/* Glass container */}
                <div className="glass-strong rounded-3xl p-2 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                    {/* Animated border glow */}
                    <motion.div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
                        }}
                        animate={{
                            x: ['-100%', '100%']
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />

                    <div className="relative flex items-end gap-3 p-2">
                        {/* Sparkle icon */}
                        <motion.div
                            animate={{
                                rotate: [0, 10, 0, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                            className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
                        >
                            <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>

                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={isLoading}
                            rows={1}
                            className="flex-1 bg-transparent text-white placeholder:text-gray-400 resize-none outline-none text-base py-2 max-h-32 disabled:opacity-50"
                            style={{ minHeight: '2.5rem' }}
                        />

                        {/* Send button */}
                        <AnimatePresence mode="wait">
                            {input.trim() && (
                                <motion.button
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSend}
                                    disabled={isLoading}
                                    className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-cyan-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5 text-white" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* AI hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: input ? 0 : 0.6 }}
                        className="absolute bottom-2 right-4 text-xs text-gray-500 pointer-events-none"
                    >
                        Enter para enviar • Shift+Enter para nova linha
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
