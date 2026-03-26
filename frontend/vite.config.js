import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

/** Config file lives in frontend/ — pin root + envDir so .env loads from frontend/ even if vite is launched from another cwd. */
const frontendDir = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    root: frontendDir,
    envDir: frontendDir,
    plugins: [
        react(),
        eslint({
            lintOnStart: true,
            failOnError: mode === "production",
        }),
    ],
    server: {
        port: 5174,
        proxy: {
            "/api": "http://localhost:8000",
        },
    },
    // To automatically open the app in the browser whenever the server starts,
    // uncomment the following lines:
    // server: {
    //   open: true
    // }
}));
