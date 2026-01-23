"use client";

import { useState } from "react";
import { UserCircle, ShoppingBag, Hand, Star, FileText, Copy, Check, Loader2, Sparkles, Landmark, Image, Cat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TabNavigation from "@/components/TabNavigation";
import InfluencerTab, { InfluencerData } from "@/components/tabs/InfluencerTab";
import FashionTab, { FashionData } from "@/components/tabs/FashionTab";
import POVProductTab, { POVProductData } from "@/components/tabs/POVProductTab";
import InfluencerShowcaseTab, { InfluencerShowcaseData } from "@/components/tabs/InfluencerShowcaseTab";
import ScriptTab, { ScriptData } from "@/components/tabs/ScriptTab";
import ScenarioTab, { ScenarioData } from "@/components/tabs/ScenarioTab";
import ThumbnailTab, { ThumbnailData } from "@/components/tabs/ThumbnailTab";
import PetsTab, { PetsData } from "@/components/tabs/PetsTab";

type TabType = "influencer" | "fashion" | "pov" | "showcase" | "script" | "scenario" | "thumbnail" | "pets";

export default function Home() {
    const [activeTab, setActiveTab] = useState<TabType>("influencer");
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);
    const [error, setError] = useState("");

    const tabs = [
        { id: "influencer", label: "Influencer Setup", icon: UserCircle },
        { id: "fashion", label: "Moda & Look", icon: ShoppingBag },
        { id: "pov", label: "POV Produto", icon: Hand },
        { id: "showcase", label: "Influencer + Produto", icon: Star },
        { id: "script", label: "Roteiro Viral", icon: FileText },
        { id: "scenario", label: "Cenários", icon: Landmark },
        { id: "thumbnail", label: "Thumbnail", icon: Image },
        { id: "pets", label: "Pets", icon: Cat },
    ];

    const handleError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(""), 4000);
    };

    const handleGenerate = async (data: InfluencerData | FashionData | POVProductData | InfluencerShowcaseData | ScriptData | ScenarioData | ThumbnailData | PetsData) => {
        setIsLoading(true);
        setError("");
        setGeneratedPrompt("");

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tabType: activeTab,
                    ...data,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Erro ao gerar prompt");
            }

            setGeneratedPrompt(result.prompt);
        } catch (err: any) {
            handleError(err.message || "Erro ao conectar com a API");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Erro ao copiar:", err);
        }
    };

    const handleCopyScript = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedScriptIndex(index);
            setTimeout(() => setCopiedScriptIndex(null), 2000);
        } catch (err) {
            console.error("Erro ao copiar:", err);
        }
    };

    const multiPrompts = generatedPrompt
        ? generatedPrompt.split("---").map(s => s.trim()).filter(s => s.length > 0)
        : [];

    const showMultiPrompts = multiPrompts.length > 1;

    return (
        <main className="aurora-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-balance">
            {/* Cinematic Grain is applied via body::before in globals.css */}

            {/* Animated Ambient Orbs are in .aurora-bg */}

            <div className="w-full max-w-5xl mx-auto space-y-10 py-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="text-center space-y-6"
                >
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <motion.div
                            className="w-20 h-20 bg-gradient-to-br from-accent-cyan to-accent-purple rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)]"
                            animate={{
                                rotate: [0, 5, 0, -5, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity
                            }}
                        >
                            <Sparkles className="w-10 h-10 text-white fill-white/20" />
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <motion.h1
                            className="text-6xl md:text-8xl font-black tracking-tighter iridescent bg-300% animate-shine"
                            style={{ backgroundSize: '200%' }}
                        >
                            ViralShop AI
                        </motion.h1>

                        <motion.p
                            className="text-gray-300 text-lg md:text-2xl font-light tracking-wide"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            O <span className="text-accent-cyan font-semibold">Standard Ouro</span> em Prompts para TikTok Shop
                        </motion.p>
                    </div>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.3 }}
                    className="glass-ultra rounded-[2.5rem] p-8 md:p-12 space-y-10"
                >
                    {/* Tab Navigation */}
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(tabId) => {
                            setActiveTab(tabId as TabType);
                            setGeneratedPrompt("");
                            setError("");
                        }}
                    />

                    {/* Tab Content */}
                    <div className="pt-2 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                            >
                                {activeTab === "influencer" && (
                                    <InfluencerTab
                                        onGenerate={(data) => handleGenerate(data)}
                                        isLoading={isLoading}
                                        onError={handleError}
                                    />
                                )}
                                {activeTab === "fashion" && (
                                    <FashionTab
                                        onGenerate={(data) => handleGenerate(data)}
                                        isLoading={isLoading}
                                        onError={handleError}
                                    />
                                )}
                                {activeTab === "pov" && (
                                    <POVProductTab
                                        onGenerate={(data) => handleGenerate(data)}
                                        isLoading={isLoading}
                                        onError={handleError}
                                    />
                                )}
                                {activeTab === "showcase" && (
                                    <InfluencerShowcaseTab
                                        onGenerate={(data) => handleGenerate(data)}
                                        isLoading={isLoading}
                                        onError={handleError}
                                    />
                                )}
                                {activeTab === "script" && (
                                    <ScriptTab
                                        onGenerate={(data) => handleGenerate(data)}
                                        isLoading={isLoading}
                                        onError={handleError}
                                    />
                                )}
                                {activeTab === "scenario" && (
                                    <ScenarioTab
                                        onGenerate={(data) => handleGenerate(data)}
                                        isLoading={isLoading}
                                        onError={handleError}
                                    />
                                )}
                                {activeTab === "thumbnail" && (
                                    <ThumbnailTab
                                        onGenerate={(data) => handleGenerate(data)}
                                        isLoading={isLoading}
                                        onError={handleError}
                                    />
                                )}
                                {activeTab === "pets" && (
                                    <PetsTab
                                        onGenerate={(data) => handleGenerate(data)}
                                        isLoading={isLoading}
                                        onError={handleError}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Error Message - Toast Style */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute bottom-6 left-0 right-0 mx-auto w-max max-w-md z-50 bg-red-500/10 border border-red-500/40 rounded-full px-8 py-4 text-red-200 text-sm font-medium backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] flex items-center gap-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading Indication - Overlay */}
                    <AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center gap-6"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-t-2 border-r-2 border-accent-cyan/80 animate-spin" />
                                    <div className="absolute inset-0 w-24 h-24 rounded-full border-b-2 border-l-2 border-accent-purple/80 animate-spin flex items-center justify-center p-2" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
                                </div>

                                <motion.span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple font-bold text-xl tracking-widest uppercase"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Gerando Mágica...
                                </motion.span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Generated Prompt Area */}
                    <AnimatePresence>
                        {generatedPrompt && !isLoading && !showMultiPrompts && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6 pt-6 border-t border-white/5"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-accent-cyan" />
                                        Seu Prompt Master Class
                                    </h3>
                                    <motion.button
                                        onClick={() => handleCopy(generatedPrompt)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-liquid px-6 py-2 rounded-full text-white font-bold text-sm tracking-wide flex items-center gap-2"
                                    >
                                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {isCopied ? "COPIADO!" : "COPIAR PROMPT"}
                                    </motion.button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-2xl opacity-30 group-hover:opacity-50 transition duration-500 blur"></div>
                                    <textarea
                                        value={generatedPrompt}
                                        readOnly
                                        rows={12}
                                        className="relative w-full px-6 py-5 bg-[#050508] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none font-mono text-sm leading-relaxed text-gray-300 shadow-inner"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Scripts Display */}
                    <AnimatePresence>
                        {generatedPrompt && !isLoading && showMultiPrompts && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6"
                            >
                                {multiPrompts.map((prompt, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/20 to-accent-purple/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
                                        <div className="relative h-full bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-accent-purple/50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-accent-cyan tracking-wider uppercase">
                                                    {activeTab === 'script' ? `Opção 0${index + 1}` : `Clip 0${index + 1}`}
                                                </span>
                                                <button
                                                    onClick={() => handleCopyScript(prompt, index)}
                                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                                >
                                                    {copiedScriptIndex === index ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                                "{prompt}"
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center pb-8 pt-4"
                >
                    <p className="text-gray-500 text-xs font-medium tracking-widest uppercase mb-2">
                        ViralShop AI • Premium Generation Engine
                    </p>
                    <motion.div
                        className="group relative inline-block cursor-default"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink rounded-lg blur opacity-20 group-hover:opacity-75 transition duration-500"></div>
                        <span className="relative text-xs font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-300% animate-shine">
                            Desenvolvido por Victor Hugo
                        </span>
                    </motion.div>
                </motion.footer>
            </div>
        </main>
    );
}
