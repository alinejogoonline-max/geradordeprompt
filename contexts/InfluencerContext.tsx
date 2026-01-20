"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface InfluencerData {
    gender: string;
    age: number;
    ethnicity: string;
    hairColor: string;
    eyeColor: string;
    extraDetails: string;
    referencePhoto?: string; // base64
    jsonConfig?: string;
}

interface InfluencerContextType {
    influencer: InfluencerData | null;
    setInfluencer: (data: InfluencerData) => void;
    clearInfluencer: () => void;
}

const InfluencerContext = createContext<InfluencerContextType | undefined>(undefined);

export function InfluencerProvider({ children }: { children: ReactNode }) {
    const [influencer, setInfluencerState] = useState<InfluencerData | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('viralshop_influencer');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setInfluencerState(data);
            } catch (e) {
                console.error('Error loading influencer data:', e);
            }
        }
    }, []);

    const setInfluencer = (data: InfluencerData) => {
        setInfluencerState(data);
        localStorage.setItem('viralshop_influencer', JSON.stringify(data));
    };

    const clearInfluencer = () => {
        setInfluencerState(null);
        localStorage.removeItem('viralshop_influencer');
    };

    return (
        <InfluencerContext.Provider value={{ influencer, setInfluencer, clearInfluencer }}>
            {children}
        </InfluencerContext.Provider>
    );
}

export function useInfluencer() {
    const context = useContext(InfluencerContext);
    if (context === undefined) {
        throw new Error('useInfluencer must be used within InfluencerProvider');
    }
    return context;
}
