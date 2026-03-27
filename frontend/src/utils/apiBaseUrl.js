/**
 * When the frontend is on a different host than the API (e.g. Render static site + API service),
 * set VITE_API_BASE_URL to the backend origin (no trailing slash), e.g. https://dineair-api.onrender.com
 * Leave unset for same-origin / Vite proxy dev.
 */
export function getApiBaseUrl() {
    const raw = import.meta.env.VITE_API_BASE_URL;
    if (typeof raw !== "string") return "";
    const t = raw.trim();
    if (!t) return "";
    return t.replace(/\/$/, "");
}

/**
 * @param {string} path — must start with / for API paths
 */
export function resolveApiUrl(path) {
    if (typeof path !== "string" || !path.startsWith("/")) return path;
    const base = getApiBaseUrl();
    return base ? `${base}${path}` : path;
}
