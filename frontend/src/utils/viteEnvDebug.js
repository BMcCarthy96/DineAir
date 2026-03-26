/**
 * Development-only logging of import.meta.env (values masked when sensitive).
 * Never logs full API keys or secrets.
 */

const PREFIX = "[DineAir][Vite env]";

/**
 * @param {string} key
 * @returns {boolean}
 */
function isSensitiveEnvKey(key) {
    const k = key.toUpperCase();
    if (k.startsWith("VITE_")) return true;
    return /(KEY|SECRET|TOKEN|PASSWORD|AUTH|PRIVATE)/i.test(key);
}

/**
 * @param {string} value
 * @returns {string}
 */
function maskSensitiveValue(value) {
    const v = String(value ?? "");
    if (!v) return "(empty)";
    if (v.length < 8) return "(set, redacted)";
    return `${v.slice(0, 4)}…${v.slice(-4)}`;
}

/**
 * Log sorted import.meta.env keys once in development.
 * Safe for production: no-op when not DEV.
 */
export function logViteEnvInDevelopment() {
    if (!import.meta.env.DEV) return;

    const entries = Object.keys(import.meta.env)
        .sort()
        .map((key) => {
            const raw = import.meta.env[key];
            const value =
                isSensitiveEnvKey(key) && raw !== undefined && raw !== ""
                    ? maskSensitiveValue(String(raw))
                    : String(raw);
            return { key, value };
        });

    const envSnapshot = Object.fromEntries(
        entries.map(({ key, value }) => [key, value])
    );
    console.info(
        PREFIX,
        "Client env keys (sensitive values masked):",
        envSnapshot
    );

    const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const trimmed =
        typeof mapsKey === "string" ? mapsKey.trim() : "";
    if (!trimmed) {
        console.info(
            PREFIX,
            "VITE_GOOGLE_MAPS_API_KEY is empty. Create frontend/.env from frontend/.env.example and restart the dev server (run npm run dev from the frontend directory)."
        );
    }
}
