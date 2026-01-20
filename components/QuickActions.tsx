"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface QuickAction {
    id: string;
    label: string;
    icon: LucideIcon;
    gradient: string;
}

interface QuickActionsProps {
    actions: QuickAction[];
    onSelect: (actionId: string) => void;
}

export default function QuickActions({ actions, onSelect }: QuickActionsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 mb-4"
        >
            {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <motion.button
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(action.id)}
                        className={`group relative px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 overflow-hidden transition-all ${action.gradient} text-white shadow-lg hover:shadow-xl`}
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                                x: ['-200%', '200%']
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        />

                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{action.label}</span>
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
