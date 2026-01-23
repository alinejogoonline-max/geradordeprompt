"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MultiImageUploadProps {
    onImagesChange: (files: File[], previews: string[]) => void;
    currentImages?: string[];
    maxImages?: number;
    label?: string;
}

export default function MultiImageUpload({
    onImagesChange,
    currentImages = [],
    maxImages = 5,
    label = "Upload das Imagens"
}: MultiImageUploadProps) {
    const [error, setError] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setError("");

        // Handle rejected files
        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.file.size > 5 * 1024 * 1024) {
                setError("Arquivo muito grande! Máximo 5MB por imagem.");
            } else {
                setError("Formato inválido! Use JPG ou PNG.");
            }
            return;
        }

        // Check if adding these files would exceed the limit
        const totalImages = currentImages.length + acceptedFiles.length;
        if (totalImages > maxImages) {
            setError(`Máximo de ${maxImages} imagens permitidas!`);
            return;
        }

        if (acceptedFiles.length > 0) {
            const newFiles = [...files, ...acceptedFiles];
            const newPreviews: string[] = [];
            let processedCount = 0;

            acceptedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    newPreviews.push(reader.result as string);
                    processedCount++;

                    // When all files are processed, update state
                    if (processedCount === acceptedFiles.length) {
                        const allPreviews = [...currentImages, ...newPreviews];
                        setFiles(newFiles);
                        onImagesChange(newFiles, allPreviews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }, [currentImages, files, maxImages, onImagesChange]);

    const handleRemove = (index: number) => {
        const newPreviews = currentImages.filter((_, i) => i !== index);
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onImagesChange(newFiles, newPreviews);
        setError("");
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: true,
        disabled: currentImages.length >= maxImages
    });

    const canAddMore = currentImages.length < maxImages;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-200">
                    {label}
                </label>
                <span className="text-xs text-gray-400">
                    {currentImages.length}/{maxImages} imagens
                </span>
            </div>

            {/* Image Gallery */}
            {currentImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <AnimatePresence>
                        {currentImages.map((preview, index) => (
                            <motion.div
                                key={`${preview}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative group aspect-square"
                            >
                                <img
                                    src={preview}
                                    alt={`Produto ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-white/10"
                                />
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-1 right-1 p-1.5 bg-red-500/90 hover:bg-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
                                    {index + 1}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Upload Area */}
            {canAddMore && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                            transition-all
                            ${isDragActive
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-white/20 hover:border-white/40 bg-white/5"
                            }
                        `}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-2">
                            {isDragActive ? (
                                <Upload className="w-10 h-10 text-blue-400 animate-bounce" />
                            ) : currentImages.length > 0 ? (
                                <Plus className="w-10 h-10 text-gray-400" />
                            ) : (
                                <ImageIcon className="w-10 h-10 text-gray-400" />
                            )}
                            <div>
                                <p className="text-gray-300 font-medium text-sm">
                                    {isDragActive
                                        ? "Solte as imagens aqui"
                                        : currentImages.length > 0
                                            ? "Adicionar mais imagens"
                                            : "Arraste imagens ou clique"
                                    }
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    JPG ou PNG, máx 5MB cada • {maxImages - currentImages.length} restantes
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Helpful Tip */}
            {currentImages.length === 0 && (
                <p className="text-xs text-gray-500">
                    💡 Adicione múltiplas fotos do produto (frente, verso, detalhes) para melhor análise
                </p>
            )}
        </div>
    );
}
