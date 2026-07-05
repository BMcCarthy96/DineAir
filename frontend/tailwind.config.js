/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    darkMode: ["selector", "body.dark"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "InterVariable",
                    "Inter",
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                ],
                display: [
                    "Space Grotesk Variable",
                    "Space Grotesk",
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                ],
                mono: [
                    "IBM Plex Mono",
                    "ui-monospace",
                    "SFMono-Regular",
                    "monospace",
                ],
            },
            colors: {
                brand: {
                    50: "#fffbeb",
                    100: "#fef3c7",
                    200: "#fde68a",
                    300: "#fcd34d",
                    400: "#fbbf24",
                    500: "#f59e0b",
                    600: "#d97706",
                    700: "#b45309",
                    800: "#92400e",
                    900: "#78350f",
                },
                night: {
                    50: "#eef1f8",
                    100: "#dbe1f0",
                    200: "#aebadb",
                    300: "#7d8db8",
                    400: "#4c5c86",
                    500: "#2e3c60",
                    600: "#232f4d",
                    700: "#1a2439",
                    800: "#121a2b",
                    900: "#0c111f",
                    950: "#060913",
                },
                surface: {
                    DEFAULT: "#ffffff",
                    muted: "#f4f6f9",
                    inverse: "#0c111f",
                },
            },
            boxShadow: {
                soft: "0 4px 24px -4px rgba(6, 9, 19, 0.08), 0 8px 32px -8px rgba(6, 9, 19, 0.12)",
                "soft-lg":
                    "0 12px 40px -12px rgba(6, 9, 19, 0.16), 0 24px 64px -24px rgba(6, 9, 19, 0.2)",
                glow: "0 0 0 1px rgba(245, 158, 11, 0.15), 0 8px 32px -8px rgba(245, 158, 11, 0.35)",
            },
            animation: {
                "fade-up": "fadeUp 0.6s ease-out forwards",
                "fade-in": "fadeIn 0.4s ease-out forwards",
                flicker: "flicker 2.6s ease-in-out infinite",
            },
            keyframes: {
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(16px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                flicker: {
                    "0%, 100%": { opacity: "1" },
                    "92%": { opacity: "1" },
                    "94%": { opacity: "0.55" },
                    "96%": { opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};
