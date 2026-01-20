"use client";

import { useState } from "react";

interface ScriptTabProps {
    onGenerate: (data: ScriptData) => void;
    isLoading: boolean;
    onError: (msg: string) => void;
}

export interface ScriptData {
    productName: string;
    mainBenefit: string;
    tone: string;
}

export default function ScriptTab({ onGenerate, isLoading, onError }: ScriptTabProps) {
    const [productName, setProductName] = useState("");
    const [mainBenefit, setMainBenefit] = useState("");
    const [tone, setTone] = useState("energetic");

    const handleSubmit = () => {
        if (!productName) return onError("Preencha o nome do produto");
        if (!mainBenefit) return onError("Preencha o benefício principal");

        onGenerate({ productName, mainBenefit, tone });
    };

    return (
        <div className="space-y-5">
            <div>
                <label htmlFor="productName" className="block text-sm font-semibold mb-3 text-gray-100 flex items-center gap-1">
                    Nome do Produto <span className="text-accent-cyan">*</span>
                </label>
                <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Creme Anti-Idade Premium, Sérum Facial..."
                    className="w-full p-4 bg-[#0a0a0f]/60 border border-white/10 rounded-xl text-white outline-none focus:border-accent-purple transition-all input-premium placeholder:text-gray-500"
                    disabled={isLoading}
                />
            </div>

            <div>
                <label htmlFor="mainBenefit" className="block text-sm font-semibold mb-3 text-gray-100 flex items-center gap-1">
                    Benefício Principal <span className="text-accent-cyan">*</span>
                </label>
                <input
                    id="mainBenefit"
                    type="text"
                    value={mainBenefit}
                    onChange={(e) => setMainBenefit(e.target.value)}
                    placeholder="Ex: remove rugas em 7 dias, hidrata por 24h..."
                    className="w-full p-4 bg-[#0a0a0f]/60 border border-white/10 rounded-xl text-white outline-none focus:border-accent-purple transition-all input-premium placeholder:text-gray-500"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                    💡 Dica: Seja específico no benefício para hooks mais eficazes
                </p>
            </div>

            <div>
                <label htmlFor="tone" className="block text-sm font-semibold mb-3 text-gray-100 flex items-center gap-1">
                    Tom de Voz <span className="text-accent-cyan">*</span>
                </label>
                <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-4 bg-[#0a0a0f]/60 border border-white/10 rounded-xl text-white outline-none focus:border-accent-purple transition-all input-premium"
                    disabled={isLoading}
                >
                    <option value="energetic">⚡ Energético / Animado</option>
                    <option value="professional">🎓 Profissional / Especialista</option>
                    <option value="humorous">😂 Humorístico / Descontraído</option>
                    <option value="emotional">💖 Emocional / Inspirador</option>
                    <option value="urgent">🚨 Urgente / FOMO (Escassez)</option>
                    <option value="asmr">🌿 Relaxado / ASMR</option>
                </select>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-liquid w-full py-5 rounded-2xl text-white font-bold text-lg tracking-wide shadow-lg hover:shadow-accent-purple/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {isLoading ? "Gerando hooks virais..." : "🔥 Gerar 3 Roteiros Virais"}
            </button>
        </div>
    );
}
