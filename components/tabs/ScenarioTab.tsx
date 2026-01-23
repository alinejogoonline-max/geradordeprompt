"use client";

import { useState } from "react";

interface ScenarioTabProps {
    onGenerate: (data: ScenarioData) => void;
    isLoading: boolean;
    onError: (msg: string) => void;
}

export interface ScenarioData {
    environmentType: string;
    visualStyle: string;
    lighting: string;
    details: string;
}

export default function ScenarioTab({ onGenerate, isLoading, onError }: ScenarioTabProps) {
    const [environmentType, setEnvironmentType] = useState("");
    const [customEnvironment, setCustomEnvironment] = useState("");
    const [visualStyle, setVisualStyle] = useState("realistic");
    const [lighting, setLighting] = useState("golden_hour");
    const [details, setDetails] = useState("");

    const handleSubmit = () => {
        if (!environmentType) return onError("Selecione o tipo de ambiente");
        if (environmentType === "custom" && !customEnvironment.trim()) {
            return onError("Por favor, descreva o ambiente personalizado");
        }

        const finalEnvironment = environmentType === "custom" ? customEnvironment : environmentType;

        onGenerate({
            environmentType: finalEnvironment,
            visualStyle,
            lighting,
            details
        });
    };

    return (
        <div className="space-y-5">
            {/* Environment Type */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1 flex items-center gap-2">
                    Tipo de Ambiente
                </label>
                <select
                    value={environmentType}
                    onChange={(e) => setEnvironmentType(e.target.value)}
                    className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                    disabled={isLoading}
                >
                    <option value="" disabled>Selecione o ambiente...</option>
                    <option value="cafe">☕ Café / Coffee Shop</option>
                    <option value="beach">🏖️ Praia</option>
                    <option value="bedroom">🛏️ Quarto / Bedroom</option>
                    <option value="office">💼 Escritório Moderno</option>
                    <option value="nature">🌲 Natureza / Floresta</option>
                    <option value="urban">🌆 Urbano / Cidade</option>
                    <option value="studio">🎬 Estúdio Fotográfico</option>
                    <option value="library">📚 Biblioteca</option>
                    <option value="gym">🏋️ Academia</option>
                    <option value="restaurant">🍽️ Restaurante Elegante</option>
                    <option value="rooftop">🏙️ Rooftop / Terraço</option>
                    <option value="kitchen">👨‍🍳 Cozinha Gourmet</option>
                    <option value="custom">✏️ Personalizado</option>
                </select>

                {/* Custom Environment Input - Conditional */}
                {environmentType === "custom" && (
                    <div className="mt-3 animate-fadeIn">
                        <input
                            type="text"
                            value={customEnvironment}
                            onChange={(e) => setCustomEnvironment(e.target.value)}
                            placeholder="Ex: Loja de discos vintage, Ateliê de arte, Garagem com carros clássicos..."
                            className="w-full px-5 py-4 bg-white/5 border-2 border-purple-500/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500 hover:border-purple-500/70 text-gray-200"
                            disabled={isLoading}
                        />
                    </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                    💡 {environmentType === "custom" ? "Descreva o ambiente que você quer gerar" : "Escolha o tipo de cenário para o prompt"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Style */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Estilo Visual</label>
                    <select
                        value={visualStyle}
                        onChange={(e) => setVisualStyle(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                        disabled={isLoading}
                    >
                        <option value="realistic">📸 Realista / Fotográfico</option>
                        <option value="cinematic">🎬 Cinemático</option>
                        <option value="minimalist">⚪ Minimalista / Clean</option>
                        <option value="cozy">🕯️ Aconchegante / Cozy</option>
                        <option value="luxury">💎 Luxuoso / High-End</option>
                        <option value="vibrant">🌈 Vibrante / Colorido</option>
                        <option value="moody">🌑 Moody / Atmosférico</option>
                        <option value="retro">📻 Vintage / Retro</option>
                    </select>
                </div>

                {/* Lighting */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Iluminação</label>
                    <select
                        value={lighting}
                        onChange={(e) => setLighting(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                        disabled={isLoading}
                    >
                        <option value="golden_hour">🌅 Golden Hour (Pôr do Sol)</option>
                        <option value="midday">☀️ Meio-Dia (Luz Natural Forte)</option>
                        <option value="night">🌃 Noite (Luzes Artificiais)</option>
                        <option value="blue_hour">🌆 Blue Hour (Crepúsculo)</option>
                        <option value="studio">🎬 Iluminação de Estúdio</option>
                        <option value="window">🪟 Luz Natural de Janela</option>
                        <option value="neon">💡 Neon / RGB</option>
                        <option value="candlelight">🕯️ Luz de Velas</option>
                        <option value="overcast">☁️ Nublado / Difuso</option>
                    </select>
                </div>
            </div>

            {/* Extra Details */}
            <div>
                <label htmlFor="details" className="block text-sm font-semibold mb-3 text-gray-100 flex items-center gap-1">
                    Detalhes Extras <span className="text-gray-500">(opcional)</span>
                </label>
                <textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Ex: Plantas pendentes, estante com livros antigos, pôsteres na parede, piso de madeira rústica..."
                    rows={4}
                    className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500 hover:border-white/20 resize-none"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                    💡 Adicione elementos específicos que deseja ver no cenário
                </p>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading || !environmentType}
                className="group relative w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-5 rounded-2xl transition-all transform hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] disabled:scale-100 shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden disabled:cursor-not-allowed"
            >
                {isLoading ? "Gerando Prompt..." : "Gerar Prompt de Cenário"}
            </button>
        </div>
    );
}
