/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    darkMode: ["selector", "body.dark"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "Inter",
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                ],
            },
            colors: {
                brand: {
                    50: "#fff5f3",
                    100: "#ffe4df",
                    200: "#ffc9bf",
                    300: "#ff9f8f",
                    400: "#ff6b52",
                    500: "#e94e3c",
                    600: "#d43c2a",
                    700: "#b32f21",
                    800: "#942a1f",
                    900: "#7b281f",
                },
                surface: {
                    DEFAULT: "#ffffff",
                    muted: "#f4f6f9",
                    inverse: "#0f1419",
                },
            },
            boxShadow: {
                soft: "0 4px 24px -4px rgba(15, 20, 25, 0.08), 0 8px 32px -8px rgba(15, 20, 25, 0.12)",
                "soft-lg":
                    "0 12px 40px -12px rgba(15, 20, 25, 0.12), 0 24px 64px -24px rgba(15, 20, 25, 0.14)",
            },
            animation: {
                "fade-up": "fadeUp 0.6s ease-out forwards",
                "fade-in": "fadeIn 0.4s ease-out forwards",
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
            },
        },
    },
    plugins: [],
};
