"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Tab {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <motion.button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={`
              relative flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-xl
              font-semibold text-sm transition-all
              ${isActive
                                ? "text-white"
                                : "text-gray-400 hover:text-gray-200"
                            }
            `}
                    >
                        {isActive && (
                            <>
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl elevation-medium"
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                                />
                                {/* Glow effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-50"
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity
                                    }}
                                />
                            </>
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <Icon className="w-5 h-5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
