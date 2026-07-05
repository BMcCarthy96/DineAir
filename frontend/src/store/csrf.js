import { apiFetch } from "../utils/apiFetch";

/**
 * @deprecated prefer `apiFetch` from utils/apiFetch — this is a thin shim that keeps the legacy
 * throw-on-4xx/5xx contract for call sites that still expect it.
 */
export async function csrfFetch(url, options = {}) {
    const res = await apiFetch(url, options);
    if (res.status >= 400) throw res;
    return res;
}

// call this to get the "XSRF-TOKEN" cookie, should only be used in development
export function restoreCSRF() {
    return csrfFetch("/api/csrf/restore");
}
