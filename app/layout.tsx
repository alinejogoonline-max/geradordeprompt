import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InfluencerProvider } from "@/contexts/InfluencerContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ViralShop AI - TikTok Prompt Generator",
    description: "Gere prompts profissionais para TikTok Shop com consistência de personagem",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <InfluencerProvider>
                    {children}
                </InfluencerProvider>
            </body>
        </html>
    );
}
