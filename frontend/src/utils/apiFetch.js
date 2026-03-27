import { resolveApiUrl } from "./apiBaseUrl";

/**
 * Same-origin or cross-origin API fetch with cookies (JWT is httpOnly; Bearer header is optional legacy).
 * Set VITE_API_BASE_URL in production when the API is on another host (e.g. Render).
 */
export function apiFetch(url, options = {}) {
    const resolved = typeof url === "string" ? resolveApiUrl(url) : url;
    return fetch(resolved, {
        credentials: "include",
        ...options,
        headers: {
            ...options.headers,
        },
    });
}
