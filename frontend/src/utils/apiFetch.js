import Cookies from "js-cookie";
import { resolveApiUrl } from "./apiBaseUrl";

/**
 * Single fetch wrapper for the whole app: resolves cross-origin API base URL, sends cookies
 * (JWT is httpOnly), and attaches the XSRF-Token header + JSON Content-Type on mutating requests.
 * Does not throw on 4xx/5xx — callers check `response.ok` (matches native fetch semantics).
 * Set VITE_API_BASE_URL in production when the API is on another host (e.g. Render).
 */
export function apiFetch(url, options = {}) {
    const resolved = typeof url === "string" ? resolveApiUrl(url) : url;
    const method = (options.method || "GET").toUpperCase();
    const headers = { ...options.headers };

    if (method !== "GET" && method !== "HEAD") {
        if (
            options.body &&
            !(options.body instanceof FormData) &&
            !headers["Content-Type"]
        ) {
            headers["Content-Type"] = "application/json";
        }
        const csrfToken = Cookies.get("XSRF-TOKEN");
        if (csrfToken) headers["XSRF-Token"] = csrfToken;
    }

    return fetch(resolved, {
        credentials: "include",
        ...options,
        headers,
    });
}
