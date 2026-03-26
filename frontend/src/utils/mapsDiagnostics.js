/**
 * Shared Google Maps diagnostics helpers (dev logging + safe snapshots).
 * Does not log or expose full API keys.
 */

export const MAPS_LOG_PREFIX = "[DineAir Maps]";

/**
 * @param {'log'|'info'|'warn'|'error'} level
 * @param {...unknown} args
 */
export function devLogMaps(level, ...args) {
    if (!import.meta.env.DEV) return;
    const fn = console[level] ?? console.log;
    fn(MAPS_LOG_PREFIX, ...args);
}

/**
 * Mask API key for display (never full key).
 * @param {string} key
 * @returns {string}
 */
export function maskApiKeyForDisplay(key) {
    const k = (key ?? "").trim();
    if (!k) return "(not set)";
    if (k.length < 8) return "(set, too short to mask safely)";
    return `${k.slice(0, 4)}…${k.slice(-4)}`;
}

/**
 * @returns {{ scriptInDom: boolean, scriptDatasetLoaded: boolean | null, scriptSrcSanitized: string | null, hasGoogle: boolean, hasMapsMap: boolean }}
 */
export function getMapsPresenceSnapshot() {
    if (typeof window === "undefined") {
        return {
            scriptInDom: false,
            scriptDatasetLoaded: null,
            scriptSrcSanitized: null,
            hasGoogle: false,
            hasMapsMap: false,
        };
    }
    const el = document.querySelector(
        'script[data-dineair-google-maps="true"]'
    );
    const src = el?.getAttribute("src") ?? null;
    const scriptSrcSanitized = src
        ? src.replace(/([?&]key=)[^&]*/i, "$1***")
        : null;
    return {
        scriptInDom: !!el,
        scriptDatasetLoaded: el ? el.dataset.dineairMapsLoaded === "true" : null,
        scriptSrcSanitized,
        hasGoogle: typeof window.google !== "undefined",
        hasMapsMap: !!window.google?.maps?.Map,
    };
}

/**
 * Human hints for common load failures (setup vs code).
 * @param {string | undefined} phase
 * @returns {string[]}
 */
export function hintsForLoadPhase(phase) {
    switch (phase) {
        case "missing-key":
            return [
                "Set VITE_GOOGLE_MAPS_API_KEY in frontend/.env and restart the dev server.",
            ];
        case "script-network":
            return [
                "Network blocked the script (offline, ad blocker, CSP, or corporate proxy).",
                "Check DevTools → Network for maps.googleapis.com.",
            ];
        case "timeout":
            return [
                "Script did not finish in time — slow network or script never became interactive.",
            ];
        case "post-load-no-maps":
            return [
                "Typical causes: API key invalid, HTTP referrer restriction mismatch, Maps JavaScript API disabled, or billing not enabled.",
                `Add your dev origin to key restrictions (e.g. ${typeof window !== "undefined" ? window.location.origin : "http://localhost:5174"}/*).`,
            ];
        default:
            return [];
    }
}
