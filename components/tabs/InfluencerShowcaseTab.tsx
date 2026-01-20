"use client";

import { useState } from "react";
import ImageUpload from "../ImageUpload";
import { Camera, Video } from "lucide-react";

interface InfluencerShowcaseTabProps {
    onGenerate: (data: InfluencerShowcaseData) => void;
    isLoading: boolean;
    onError: (msg: string) => void;
}

export interface InfluencerShowcaseData {
    productImage: string;
    productFile: File;
    mediaType: "photo" | "video";
    influencerJSON?: string; // OPCIONAL
    customScript?: string; // OPCIONAL
    tone?: string;
}

export default function InfluencerShowcaseTab({ onGenerate, isLoading, onError }: InfluencerShowcaseTabProps) {
    const [productImage, setProductImage] = useState("");
    const [productFile, setProductFile] = useState<File | null>(null);
    const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
    const [influencerJSON, setInfluencerJSON] = useState("");
    const [customScript, setCustomScript] = useState("");
    const [tone, setTone] = useState("energetic");

    const handleImageSelect = (file: File, preview: string) => {
        setProductFile(file);
        setProductImage(preview);
    };

    const handleImageRemove = () => {
        setProductImage("");
        setProductFile(null);
    };

    const handleSubmit = () => {
        if (!productImage || !productFile) {
            return onError("Faça o upload da foto do produto para continuar");
        }

        onGenerate({
            productImage,
            productFile,
            mediaType,
            influencerJSON: influencerJSON || undefined,
            customScript: customScript || undefined,
            tone
        });
    };

    return (
        <div className="space-y-6">
            <ImageUpload
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                currentImage={productImage}
                label="Upload do Produto 📦"
            />

            {/* Influencer JSON Field - OPCIONAL */}
            <div>
                <label htmlFor="influencerJSON" className="block text-sm font-semibold mb-3 text-gray-100 flex items-center gap-1">
                    JSON do Influencer <span className="text-gray-500">(opcional)</span>
                </label>
                <textarea
                    id="influencerJSON"
                    value={influencerJSON}
                    onChange={(e) => setInfluencerJSON(e.target.value)}
                    placeholder='Cole aqui o JSON gerado na Aba 1 se quiser o influencer segurando o produto...'
                    rows={4}
                    className="w-full px-5 py-4 bg-[#0a0a0f]/60 border border-white/10 rounded-xl text-white placeholder-gray-500 font-mono text-xs resize-none input-premium"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                    💡 Se deixar vazio, gerará apenas prompt do produto sem influencer
                </p>
            </div>

            {/* Custom Script Field - OPCIONAL */}
            <div>
                <label htmlFor="customScript" className="block text-sm font-semibold mb-3 text-gray-100 flex items-center gap-1">
                    Roteiro / Script <span className="text-gray-500">(opcional)</span>
                </label>
                <textarea
                    id="customScript"
                    value={customScript}
                    onChange={(e) => setCustomScript(e.target.value)}
                    placeholder='Cole seu roteiro aqui se quiser usar um texto específico...'
                    rows={4}
                    className="w-full px-5 py-4 bg-[#0a0a0f]/60 border border-white/10 rounded-xl text-white placeholder-gray-500 font-mono text-xs resize-none input-premium"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                    💡 Se preenchido, será usado como o roteiro/áudio do prompt final
                </p>
            </div>

            {/* Tone Selector */}
            <div>
                <label htmlFor="tone" className="block text-sm font-semibold mb-3 text-gray-100 flex items-center gap-1">
                    Tom de Voz <span className="text-gray-500">(para script automático)</span>
                </label>
                <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-4 bg-[#0a0a0f]/60 border border-white/10 rounded-xl text-white outline-none focus:border-accent-pink transition-all input-premium"
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

            {/* Media Type Toggle */}
            <div>
                <label className="block text-sm font-semibold mb-3 text-gray-100">
                    Tipo de Mídia <span className="text-accent-cyan">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setMediaType("photo")}
                        disabled={isLoading}
                        className={`relative flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-bold transition-all duration-300 ${mediaType === "photo"
                            ? "bg-gradient-to-r from-accent-pink to-accent-purple text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-105"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                            }`}
                    >
                        <Camera className="w-5 h-5" />
                        <span>📸 FOTO</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMediaType("video")}
                        disabled={isLoading}
                        className={`relative flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-bold transition-all duration-300 ${mediaType === "video"
                            ? "bg-gradient-to-r from-accent-pink to-accent-purple text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-105"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                            }`}
                    >
                        <Video className="w-5 h-5" />
                        <span>🎥 VÍDEO</span>
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {mediaType === "photo"
                        ? "💡 Influencer segurando produto (Portrait Testimonial)"
                        : "💡 Influencer mostrando produto em vídeo (Viral Review)"}
                </p>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-liquid w-full py-5 rounded-2xl text-white font-bold text-lg tracking-wide shadow-lg hover:shadow-accent-pink/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {isLoading ? "Gerando com Gemini Vision..." : `✨ Gerar Testimonial ${mediaType === "photo" ? "Foto" : "Vídeo"}`}
            </button>
        </div>
    );
}
