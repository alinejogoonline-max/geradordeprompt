"use client";

import { useState } from "react";
import ImageUpload from "../ImageUpload";
import { Camera, Video } from "lucide-react";

interface POVProductTabProps {
    onGenerate: (data: POVProductData) => void;
    isLoading: boolean;
    onError: (msg: string) => void;
}

export interface POVProductData {
    image: string;
    imageFile: File;
    mediaType: "photo" | "video";
    customScript?: string; // OPCIONAL
    tone?: string;
}

export default function POVProductTab({ onGenerate, isLoading, onError }: POVProductTabProps) {
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
    const [customScript, setCustomScript] = useState("");
    const [tone, setTone] = useState("energetic");

    const handleImageSelect = (file: File, preview: string) => {
        setImageFile(file);
        setImage(preview);
    };

    const handleImageRemove = () => {
        setImage("");
        setImageFile(null);
    };

    const handleSubmit = () => {
        if (!image || !imageFile) {
            return onError("Faça o upload da foto do produto para continuar");
        }

        onGenerate({
            image,
            imageFile,
            mediaType,
            customScript: customScript || undefined,
            tone
        });
    };

    return (
        <div className="space-y-6">
            <ImageUpload
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                currentImage={image}
                label="Upload do Produto 📦"
            />

            {/* Media Type Toggle */}
            <div>
                <label className="block text-sm font-semibold mb-3 text-gray-100">
                    Tipo de Mídia <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setMediaType("photo")}
                        disabled={isLoading}
                        className={`relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${mediaType === "photo"
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/50 scale-105"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 border-2 border-white/10"
                            }`}
                    >
                        <Camera className="w-5 h-5" />
                        <span>📸 FOTO</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMediaType("video")}
                        disabled={isLoading}
                        className={`relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${mediaType === "video"
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/50 scale-105"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 border-2 border-white/10"
                            }`}
                    >
                        <Video className="w-5 h-5" />
                        <span>🎥 VÍDEO</span>
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {mediaType === "photo"
                        ? "💡 Gerará um prompt para foto macro (Product Shot POV)"
                        : "💡 Gerará um prompt para vídeo POV (Unboxing Viral)"}
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

            {/* Tone Selection */}
            <div>
                <label htmlFor="tone" className="block text-sm font-semibold mb-3 text-gray-100">
                    Tom <span className="text-accent-cyan">*</span>
                </label>
                <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-4 bg-[#0a0a0f]/60 border border-white/10 rounded-xl text-white outline-none focus:border-accent-cyan transition-all input-premium"
                    disabled={isLoading}
                >
                    <option value="energetic">⚡ Energético</option>
                    <option value="calm">🌿 Calmo</option>
                    <option value="luxurious">💎 Luxuoso</option>
                    <option value="playful">🎨 Divertido</option>
                    <option value="informative">📚 Informativo</option>
                </select>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-liquid w-full py-5 rounded-2xl text-white font-bold text-lg tracking-wide shadow-lg hover:shadow-accent-cyan/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {isLoading ? "Analisando com Gemini Vision..." : `✨ Gerar Prompt de ${mediaType === "photo" ? "Foto" : "Vídeo"}`}
            </button>
        </div>
    );
}
