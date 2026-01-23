"use client";

import { useState } from "react";
import ImageUpload from "../ImageUpload";

interface PetsTabProps {
    onGenerate: (data: PetsData) => void;
    isLoading: boolean;
    onError: (msg: string) => void;
}

export interface PetsData {
    petType: string;
    breed: string;
    action: string;
    scenario: string;
    personality: string;
    petPhoto?: string;
    details: string;
}

export default function PetsTab({ onGenerate, isLoading, onError }: PetsTabProps) {
    const [petType, setPetType] = useState("");
    const [customPetType, setCustomPetType] = useState("");
    const [breed, setBreed] = useState("");
    const [action, setAction] = useState("playing");
    const [scenario, setScenario] = useState("home");
    const [customScenario, setCustomScenario] = useState("");
    const [personality, setPersonality] = useState("cute");
    const [petPhoto, setPetPhoto] = useState("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [details, setDetails] = useState("");

    const handlePhotoSelect = (file: File, preview: string) => {
        setPhotoFile(file);
        setPetPhoto(preview);
    };

    const handlePhotoRemove = () => {
        setPetPhoto("");
        setPhotoFile(null);
    };

    const handleSubmit = () => {
        if (!petType) return onError("Selecione o tipo de pet");
        if (petType === "custom" && !customPetType.trim()) {
            return onError("Descreva o tipo de pet personalizado");
        }
        if (!breed.trim()) return onError("Descreva a raça ou aparência do pet");
        if (scenario === "custom" && !customScenario.trim()) {
            return onError("Descreva o cenário personalizado");
        }

        const finalPetType = petType === "custom" ? customPetType : petType;
        const finalScenario = scenario === "custom" ? customScenario : scenario;

        onGenerate({
            petType: finalPetType,
            breed,
            action,
            scenario: finalScenario,
            personality,
            petPhoto: petPhoto || undefined,
            details
        });
    };

    return (
        <div className="space-y-5">
            {/* Pet Photo Upload - OPCIONAL */}
            <div>
                <ImageUpload
                    onImageSelect={handlePhotoSelect}
                    onImageRemove={handlePhotoRemove}
                    currentImage={petPhoto}
                    label="Foto do Pet (opcional)"
                />
                <p className="text-xs text-gray-500 mt-2">
                    💡 Upload de uma foto do seu pet para geração mais precisa
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pet Type */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Tipo de Pet</label>
                    <select
                        value={petType}
                        onChange={(e) => setPetType(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                        disabled={isLoading}
                    >
                        <option value="" disabled>Selecione o tipo...</option>
                        <option value="dog">🐕 Cachorro</option>
                        <option value="cat">🐈 Gato</option>
                        <option value="bird">🦜 Pássaro</option>
                        <option value="rabbit">🐰 Coelho</option>
                        <option value="hamster">🐹 Hamster</option>
                        <option value="turtle">🐢 Tartaruga</option>
                        <option value="fish">🐠 Peixe</option>
                        <option value="guinea_pig">🐹 Porquinho da Índia</option>
                        <option value="custom">✏️ Outro (Personalizado)</option>
                    </select>

                    {/* Custom Pet Type Input */}
                    {petType === "custom" && (
                        <div className="mt-3 animate-fadeIn">
                            <input
                                type="text"
                                value={customPetType}
                                onChange={(e) => setCustomPetType(e.target.value)}
                                placeholder="Ex: Furão, Iguana, Mini pig..."
                                className="w-full px-5 py-4 bg-white/5 border-2 border-cyan-500/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 placeholder:text-gray-500 hover:border-cyan-500/70 transition-all"
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </div>

                {/* Breed/Description */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">
                        Raça/Descrição <span className="text-cyan-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        placeholder="Ex: Golden Retriever, Gato laranja de olhos verdes, Calopsita amarela..."
                        className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 placeholder:text-gray-600 hover:border-white/20 transition-all"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        💡 Seja específico sobre cores, tamanho, características únicas
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Action/Activity */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Ação/Atividade</label>
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                        disabled={isLoading}
                    >
                        <option value="playing">🎾 Brincando</option>
                        <option value="sleeping">😴 Dormindo</option>
                        <option value="eating">🍖 Comendo</option>
                        <option value="running">🏃 Correndo</option>
                        <option value="trick">🎪 Fazendo Trick/Truque</option>
                        <option value="staring">👀 Olhando para Câmera</option>
                        <option value="being_cute">🥺 Sendo Fofo</option>
                        <option value="making_mess">🌪️ Fazendo Bagunça</option>
                        <option value="interacting">🤝 Interagindo com Dono</option>
                        <option value="exploring">🔍 Explorando</option>
                        <option value="yawning">🥱 Bocejando</option>
                        <option value="begging">🙏 Pedindo Comida</option>
                    </select>
                </div>

                {/* Personality/Vibe */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300 ml-1">Personalidade/Vibe</label>
                    <select
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                        disabled={isLoading}
                    >
                        <option value="cute">🥰 Fofo / Adorável</option>
                        <option value="funny">😂 Engraçado / Hilário</option>
                        <option value="elegant">👑 Elegante / Sofisticado</option>
                        <option value="energetic">⚡ Energético / Hiperativo</option>
                        <option value="lazy">😴 Preguiçoso / Chill</option>
                        <option value="curious">🤔 Curioso / Investigativo</option>
                        <option value="dramatic">🎭 Dramático</option>
                        <option value="sassy">😏 Sassy / Atrevido</option>
                        <option value="majestic">🦁 Majestoso</option>
                        <option value="derpy">🤪 Derpy / Bobinho</option>
                    </select>
                </div>
            </div>

            {/* Scenario/Location */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 ml-1">Cenário/Local</label>
                <select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="w-full px-5 py-4 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 appearance-none cursor-pointer hover:border-white/20 transition-all"
                    disabled={isLoading}
                >
                    <option value="home">🏠 Casa / Quarto</option>
                    <option value="garden">🌻 Jardim / Quintal</option>
                    <option value="park">🌳 Parque</option>
                    <option value="beach">🏖️ Praia</option>
                    <option value="pool">🏊 Piscina</option>
                    <option value="car">🚗 Carro</option>
                    <option value="party">🎉 Festa / Evento</option>
                    <option value="outdoor">⛰️ Aventura Outdoor</option>
                    <option value="vet">🏥 Veterinário</option>
                    <option value="grooming">✂️ Pet Shop / Banho</option>
                    <option value="custom">✏️ Personalizado</option>
                </select>

                {/* Custom Scenario Input */}
                {scenario === "custom" && (
                    <div className="mt-3 animate-fadeIn">
                        <input
                            type="text"
                            value={customScenario}
                            onChange={(e) => setCustomScenario(e.target.value)}
                            placeholder="Ex: Na neve pela primeira vez, No shopping center, No escritório..."
                            className="w-full px-5 py-4 bg-white/5 border-2 border-cyan-500/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 placeholder:text-gray-500 hover:border-cyan-500/70 transition-all"
                            disabled={isLoading}
                        />
                    </div>
                )}
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
                    placeholder="Ex: Usando óculos de sol, Segurando brinquedo favorito, Com laço no pescoço, Orelhas grandes..."
                    rows={4}
                    className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500 hover:border-white/20 resize-none"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                    💡 Adicione acessórios, expressões faciais, ou momentos específicos
                </p>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading || !petType || !breed.trim()}
                className="group relative w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-5 rounded-2xl transition-all transform hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] disabled:scale-100 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/50 overflow-hidden disabled:cursor-not-allowed"
            >
                {isLoading ? "Gerando Prompt..." : "Gerar Prompt de Pet"}
            </button>
        </div>
    );
}
