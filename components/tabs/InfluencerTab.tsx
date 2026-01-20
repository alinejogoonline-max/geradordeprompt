"use client";

import { useState } from "react";
import ImageUpload from "../ImageUpload";

interface InfluencerTabProps {
    onGenerate: (data: InfluencerData) => void;
    isLoading: boolean;
    onError: (msg: string) => void;
}

export interface InfluencerData {
    gender: string;
    age: number;
    ethnicity: string;
    hairColor: string;
    eyeColor: string;
    extraDetails: string;
    referencePhoto?: string; // OPCIONAL agora
}

export default function InfluencerTab({ onGenerate, isLoading, onError }: InfluencerTabProps) {
    const [gender, setGender] = useState("");
    const [age, setAge] = useState(25);
    const [ethnicity, setEthnicity] = useState("");
    const [hairColor, setHairColor] = useState("");
    const [eyeColor, setEyeColor] = useState("");
    const [extraDetails, setExtraDetails] = useState("");
    const [referencePhoto, setReferencePhoto] = useState("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const handlePhotoSelect = (file: File, preview: string) => {
        setPhotoFile(file);
        setReferencePhoto(preview);
    };

    const handlePhotoRemove = () => {
        setReferencePhoto("");
        setPhotoFile(null);
    };

    const handleSubmit = () => {
        if (!gender) return onError("Selecione o gênero do influencer");
        if (!ethnicity) return onError("Selecione a etnia do influencer");
        if (!hairColor) return onError("Defina a cor do cabelo");
        if (!eyeColor) return onError("Defina a cor dos olhos");

        onGenerate({
            gender,
            age,
            ethnicity,
            hairColor,
            eyeColor,
            extraDetails,
            referencePhoto: referencePhoto || undefined
        });
    };

    return (
        <div className="space-y-5">
            {/* Reference Photo Upload - OPCIONAL */}
            <div>
                <ImageUpload
                    onImageSelect={handlePhotoSelect}
                    onImageRemove={handlePhotoRemove}
                    currentImage={referencePhoto}
                    label="Foto de Referência (opcional) 📸"
                />
                <p className="text-xs text-gray-500 mt-2">
                    💡 Opcional: Se enviada, será incluída no JSON para referência visual
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Gênero</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 appearance-none"
                    >
                        <option value="" disabled>Selecione...</option>
                        <option value="female">Feminino</option>
                        <option value="male">Masculino</option>
                    </select>
                </div>

                {/* Age */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-semibold text-gray-300">Idade</label>
                        <span className="text-accent-cyan font-bold">{age} anos</span>
                    </div>
                    <input
                        type="range"
                        min="18"
                        max="60"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ethnicity */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Etnia</label>
                    <input
                        type="text"
                        value={ethnicity}
                        onChange={(e) => setEthnicity(e.target.value)}
                        placeholder="Ex: Latina, Asiática..."
                        className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder:text-gray-600"
                    />
                </div>

                {/* Hair Color */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Cabelo</label>
                    <input
                        type="text"
                        value={hairColor}
                        onChange={(e) => setHairColor(e.target.value)}
                        placeholder="Ex: Loiro platinado, Cacheado..."
                        className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* Eye Color */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Olhos</label>
                <input
                    id="eyeColor"
                    type="text"
                    value={eyeColor}
                    onChange={(e) => setEyeColor(e.target.value)}
                    placeholder="Ex: Castanho escuro, Azul claro, Verde esmeralda..."
                    className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500 hover:border-white/20"
                    disabled={isLoading}
                />
            </div>



            {/* Extra Visual Details */}
            <div>
                <label htmlFor="extraDetails" className="block text-sm font-semibold mb-3 text-gray-100 flex items-center gap-1">
                    Detalhes Visuais Extras <span className="text-gray-500">(opcional)</span>
                </label>
                <textarea
                    id="extraDetails"
                    value={extraDetails}
                    onChange={(e) => setExtraDetails(e.target.value)}
                    placeholder="Ex: Tem sardas, usa óculos de grau, barba fechada estilo viking, tatuagem no pescoço..."
                    rows={4}
                    className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500 hover:border-white/20 resize-none"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                    💡 Dica: Seja específico! Esses detalhes serão usados na geração da imagem.
                </p>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading || !gender || !ethnicity || !hairColor || !eyeColor}
                className="group relative w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-5 rounded-2xl transition-all transform hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] disabled:scale-100 shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden elevation-medium disabled:elevation-low"
            >
                {isLoading ? "Gerando JSON..." : "🎯 Gerar JSON do Influencer"}
            </button>
        </div >
    );
}
