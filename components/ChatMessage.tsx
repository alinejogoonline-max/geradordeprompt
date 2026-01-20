"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
    const isAssistant = role === "assistant";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className={`flex gap-4 ${isAssistant ? "flex-row" : "flex-row-reverse"} items-start mb-6`}
        >
            {/* Avatar */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="relative flex-shrink-0"
            >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isAssistant
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50"
                    : "bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30"
                    }`}>
                    {isAssistant ? (
                        <Bot className="w-6 h-6 text-white" />
                    ) : (
                        <User className="w-5 h-5 text-white" />
                    )}
                </div>
                {isAssistant && (
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 blur-md opacity-50"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                    />
                )}
            </motion.div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[75%] ${isAssistant ? "" : "flex justify-end"}`}>
                <motion.div
                    initial={{ opacity: 0, x: isAssistant ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`relative group ${isAssistant
                        ? "glass-ultra rounded-[1.5rem] rounded-tl-sm p-6 border border-white/10 shadow-2xl"
                        : "bg-gradient-to-br from-blue-600 to-cyan-600 rounded-[1.5rem] rounded-tr-sm p-5 shadow-lg shadow-blue-500/20"
                        }`}
                >
                    {/* Holographic effect for AI messages */}
                    {isAssistant && (
                        <div className="absolute inset-0 rounded-[1.5rem] rounded-tl-sm bg-gradient-to-r from-accent-cyan/10 via-transparent to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    )}

                    <p className={`relative z-10 text-base leading-relaxed ${isAssistant ? "text-gray-100" : "text-white font-medium"
                        }`}>
                        {content}
                    </p>

                    {timestamp && (
                        <span className={`text-xs mt-2 block ${isAssistant ? "text-gray-500" : "text-white/60"
                            }`}>
                            {timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
