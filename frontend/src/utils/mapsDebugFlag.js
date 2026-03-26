/**
 * On-screen Maps diagnostics are opt-in (demo-friendly).
 * Enable: VITE_MAPS_DEBUG=true or ?mapsDebug=1 in the URL.
 */
export function shouldShowMapsDiagnostics() {
    if (import.meta.env.VITE_MAPS_DEBUG === "true") return true;
    if (typeof window === "undefined") return false;
    try {
        return (
            new URLSearchParams(window.location.search).get("mapsDebug") ===
            "1"
        );
    } catch {
        return false;
    }
}
