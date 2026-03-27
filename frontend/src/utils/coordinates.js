/**
 * Shared lat/lng validation for maps, markers, and tracking (avoids Google InvalidValueError).
 * @param {unknown} input
 * @returns {{ lat: number, lng: number } | null}
 */
export function normalizeLatLng(input) {
    if (input == null || typeof input !== "object") return null;
    const lat = Number(input.lat);
    const lng = Number(input.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
}

/**
 * @param {unknown} lat
 * @param {unknown} lng
 * @returns {{ lat: number, lng: number } | null}
 */
export function normalizeLatLngPair(lat, lng) {
    const la = Number(lat);
    const ln = Number(lng);
    if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
    return { lat: la, lng: ln };
}
