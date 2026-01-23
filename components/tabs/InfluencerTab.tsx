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
    location: string;
    extraDetails: string;
    referencePhoto?: string; // OPCIONAL agora
}

export default function InfluencerTab({ onGenerate, isLoading, onError }: InfluencerTabProps) {
    const [gender, setGender] = useState("");
    const [age, setAge] = useState(25);
    const [ethnicity, setEthnicity] = useState("");
    const [hairColor, setHairColor] = useState("");
    const [eyeColor, setEyeColor] = useState("");
    const [location, setLocation] = useState("random");
    const [customLocation, setCustomLocation] = useState("");
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
        if (location === "custom" && !customLocation.trim()) {
            return onError("Por favor, descreva o local personalizado");
        }

        const finalLocation = location === "custom" ? customLocation : location;

        onGenerate({
            gender,
            age,
            ethnicity,
            hairColor,
            eyeColor,
            location: finalLocation,
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
                    label="Foto de Referência (opcional)"
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
                        <span className="text-cyan-400 font-bold text-lg">{age} anos</span>
                    </div>
                    <div className="relative pt-1">
                        <input
                            type="range"
                            min="18"
                            max="60"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="age-slider w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer transition-all duration-150"
                            style={{
                                background: `linear-gradient(to right, rgb(34 211 238) 0%, rgb(34 211 238) ${((age - 18) / (60 - 18)) * 100}%, rgba(255,255,255,0.1) ${((age - 18) / (60 - 18)) * 100}%, rgba(255,255,255,0.1) 100%)`
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ethnicity / Skin Tone */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Tom de Pele / Etnia</label>
                    <select
                        value={ethnicity}
                        onChange={(e) => setEthnicity(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 appearance-none"
                    >
                        <option value="" disabled>Selecione...</option>
                        <option value="Light Skin (Caucasian)">Pele Clara (Caucasiano)</option>
                        <option value="Medium/Tan Skin (Latino/Hispanic)">Pele Morena (Latino)</option>
                        <option value="Dark Skin (Afro-descendant)">Pele Negra (Afro)</option>
                        <option value="Very Dark Skin (Deep Melanin)">Pele Retinta</option>
                        <option value="Light Skin (Asian)">Asiático (Pele Clara)</option>
                        <option value="Tan Skin (South Asian/Indian)">Sul Asiático (Indiano)</option>
                        <option value="Olive Skin (Mediterranean/Middle Eastern)">Pele Oliva (Oriente Médio)</option>
                    </select>
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

            {/* Location/Setting */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1 flex items-center gap-2">
                    Local/Cenário
                </label>
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                    disabled={isLoading}
                >
                    <option value="random">🎲 Aleatório (Deixe a IA escolher)</option>
                    <option value="cafe">☕ Café/Coffee Shop</option>
                    <option value="praia">🏖️ Praia</option>
                    <option value="casa">🏠 Casa/Quarto</option>
                    <option value="estudio">🎬 Estúdio Fotográfico</option>
                    <option value="rua">🌆 Rua/Cidade</option>
                    <option value="parque">🌳 Parque/Natureza</option>
                    <option value="academia">💪 Academia</option>
                    <option value="restaurante">🍽️ Restaurante</option>
                    <option value="escritorio">💼 Escritório</option>
                    <option value="shopping">🛍️ Shopping/Loja</option>
                    <option value="viagem">✈️ Aeroporto/Viagem</option>
                    <option value="festa">🎉 Festa/Balada</option>
                    <option value="hotel">🏨 Hotel Luxuoso</option>
                    <option value="piscina">🏊 Piscina</option>
                    <option value="varanda">🌅 Varanda/Terraço</option>
                    <option value="custom">✏️ Personalizado (Escrever próprio)</option>
                </select>

                {/* Custom Location Input - Conditional */}
                {location === "custom" && (
                    <div className="mt-3 animate-fadeIn">
                        <input
                            type="text"
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                            placeholder="Ex: Em uma biblioteca vintage, Na sacada de um penthouse, No topo de uma montanha..."
                            className="w-full px-5 py-4 bg-white/5 border-2 border-cyan-500/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500 hover:border-cyan-500/70 text-gray-200"
                            disabled={isLoading}
                        />
                    </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                    💡 {location === "custom" ? "Descreva o local exato onde deseja que o modelo/influencer apareça" : "Escolha onde o modelo/influencer estará na foto gerada"}
                </p>
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
                {isLoading ? "Gerando JSON..." : "Gerar JSON do Influencer"}
            </button>
        </div >
    );
}
