"use client";

import { useState } from "react";
import ImageUpload from "../ImageUpload";

interface ThumbnailTabProps {
    onGenerate: (data: ThumbnailData) => void;
    isLoading: boolean;
    onError: (msg: string) => void;
}

export interface ThumbnailData {
    expression: string;
    contentType: string;
    thumbnailText: string;
    influencerJSON?: string;
    referenceImage?: string;
}

export default function ThumbnailTab({ onGenerate, isLoading, onError }: ThumbnailTabProps) {
    const [expression, setExpression] = useState("");
    const [contentType, setContentType] = useState("tutorial");
    const [thumbnailText, setThumbnailText] = useState("");
    const [useInfluencer, setUseInfluencer] = useState(false);
    const [influencerJSON, setInfluencerJSON] = useState("");
    const [referenceImage, setReferenceImage] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageSelect = (file: File, preview: string) => {
        setImageFile(file);
        setReferenceImage(preview);
    };

    const handleImageRemove = () => {
        setReferenceImage("");
        setImageFile(null);
    };

    const handleSubmit = () => {
        if (!expression) return onError("Selecione a expressão/emoção");
        if (!thumbnailText.trim()) return onError("Digite o texto da thumbnail");
        if (useInfluencer && !influencerJSON.trim()) {
            return onError("Cole o JSON do influencer ou desmarque a opção");
        }

        onGenerate({
            expression,
            contentType,
            thumbnailText: thumbnailText.trim(),
            influencerJSON: useInfluencer ? influencerJSON : undefined,
            referenceImage: referenceImage || undefined
        });
    };

    return (
        <div className="space-y-5">
            {/* Reference Image Upload - OPCIONAL */}
            <div>
                <ImageUpload
                    onImageSelect={handleImageSelect}
                    onImageRemove={handleImageRemove}
                    currentImage={referenceImage}
                    label="Referência de Expressão (opcional)"
                />
                <p className="text-xs text-gray-500 mt-2">
                    💡 Upload de uma foto mostrando a expressão que você quer replicar
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expression/Emotion */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Expressão/Emoção</label>
                    <select
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                        disabled={isLoading}
                    >
                        <option value="" disabled>Selecione a expressão...</option>
                        <option value="shocked">😱 Chocado / OMG</option>
                        <option value="amazed">😍 Maravilhado / Encantado</option>
                        <option value="mindblown">🤯 Mente Explodida</option>
                        <option value="determined">😤 Determinado / Focado</option>
                        <option value="emotional">🥺 Emocional / Tocado</option>
                        <option value="smirk">😏 Sorriso Malicioso</option>
                        <option value="excited">🤩 Super Animado</option>
                        <option value="skeptical">🤨 Cético / Desconfiado</option>
                        <option value="laughing">😂 Rindo Muito</option>
                        <option value="serious">😐 Sério / Intenso</option>
                    </select>
                </div>

                {/* Content Type */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Tipo de Conteúdo</label>
                    <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                        disabled={isLoading}
                    >
                        <option value="tutorial">📚 Tutorial / Como Fazer</option>
                        <option value="review">⭐ Review / Análise</option>
                        <option value="drama">🎭 Drama / Story Time</option>
                        <option value="motivation">💪 Motivacional</option>
                        <option value="before_after">🔄 Antes/Depois</option>
                        <option value="challenge">🏆 Desafio / Challenge</option>
                        <option value="reaction">😲 Reação</option>
                        <option value="exposed">🚨 Expondo / Revelando</option>
                    </select>
                </div>
            </div>

            {/* Thumbnail Text */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">
                    Texto da Thumbnail <span className="text-pink-400">*</span>
                </label>
                <input
                    type="text"
                    value={thumbnailText}
                    onChange={(e) => setThumbnailText(e.target.value)}
                    placeholder="Ex: NÃO ACREDITO QUE FIZ ISSO! / FINALMENTE DESCOBRI"
                    className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-200 placeholder:text-gray-600 hover:border-white/20 transition-all"
                    disabled={isLoading}
                    maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                    💡 Use CAPS e seja impactante! {thumbnailText.length}/60 caracteres
                </p>
            </div>

            {/* Use Influencer JSON Checkbox */}
            <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={useInfluencer}
                        onChange={(e) => setUseInfluencer(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-white/20 bg-white/5 checked:bg-pink-500 checked:border-pink-500 cursor-pointer transition-all"
                        disabled={isLoading}
                    />
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-pink-400 transition-colors">
                        Usar JSON do Influencer da Aba 1
                    </span>
                </label>

                {useInfluencer && (
                    <div className="animate-fadeIn">
                        <textarea
                            value={influencerJSON}
                            onChange={(e) => setInfluencerJSON(e.target.value)}
                            placeholder='Cole aqui o JSON gerado na Aba "Criar Modelo"...'
                            rows={6}
                            className="w-full px-5 py-4 bg-[#0a0a0f]/60 border-2 border-pink-500/50 rounded-2xl text-white placeholder-gray-500 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 hover:border-pink-500/70 transition-all"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            💡 Se preenchido, usará as características do influencer na thumbnail
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading || !expression || !thumbnailText.trim()}
                className="group relative w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-5 rounded-2xl transition-all transform hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] disabled:scale-100 shadow-xl hover:shadow-2xl hover:shadow-pink-500/50 overflow-hidden disabled:cursor-not-allowed"
            >
                {isLoading ? "Gerando Thumbnail..." : "Gerar Prompt de Thumbnail"}
            </button>
        </div>
    );
}
