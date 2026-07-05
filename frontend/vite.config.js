import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Config file lives in frontend/ — pin root + envDir so .env loads from frontend/ even if vite is launched from another cwd. */
const frontendDir = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(() => ({
    root: frontendDir,
    envDir: frontendDir,
    plugins: [react()],
    server: {
        port: 5174,
        proxy: {
            "/api": "http://localhost:8000",
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: [path.resolve(frontendDir, "src/test/setup.js")],
    },
    // To automatically open the app in the browser whenever the server starts,
    // uncomment the following lines:
    // server: {
    //   open: true
    // }
}));
