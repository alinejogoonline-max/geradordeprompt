import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "accent-purple": "var(--accent-purple)",
                "accent-cyan": "var(--accent-cyan)",
                "accent-pink": "var(--accent-pink)",
            },
            animation: {
                "aurora-flow": "aurora-flow 20s linear infinite",
                "float-orb": "float-orb 15s ease-in-out infinite alternate",
                "soft-pulse": "soft-pulse 2s infinite",
            },
        },
    },
    plugins: [],
};
export default config;
