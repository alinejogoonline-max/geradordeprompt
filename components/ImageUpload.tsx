"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
    onImageSelect: (file: File, preview: string) => void;
    onImageRemove: () => void;
    currentImage?: string;
    label?: string;
}

export default function ImageUpload({
    onImageSelect,
    onImageRemove,
    currentImage,
    label = "Upload da Imagem"
}: ImageUploadProps) {
    const [error, setError] = useState("");

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setError("");

        // Handle rejected files
        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.file.size > 5 * 1024 * 1024) {
                setError("Arquivo muito grande! Máximo 5MB.");
            } else {
                setError("Formato inválido! Use JPG ou PNG.");
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();

            reader.onload = () => {
                onImageSelect(file, reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false
    });

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-200">
                {label}
            </label>

            <AnimatePresence mode="wait">
                {currentImage ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group"
                    >
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-white/10"
                        />
                        <button
                            onClick={onImageRemove}
                            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div
                            {...getRootProps()}
                            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all
              ${isDragActive
                                    ? "border-blue-500 bg-blue-500/10"
                                    : "border-white/20 hover:border-white/40 bg-white/5"
                                }
            `}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center gap-3">
                                {isDragActive ? (
                                    <Upload className="w-12 h-12 text-blue-400 animate-bounce" />
                                ) : (
                                    <ImageIcon className="w-12 h-12 text-gray-400" />
                                )}
                                <div>
                                    <p className="text-gray-300 font-medium">
                                        {isDragActive ? "Solte a imagem aqui" : "Arraste uma imagem ou clique"}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        JPG ou PNG, máx 5MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
        </div>
    );
}
