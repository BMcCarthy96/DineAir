/** Earth radius in meters */
const R = 6371000;

/**
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 * @returns {number}
 */
export function haversineMeters(a, b) {
    if (!a || !b) return 0;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 * @param {number} t 0–1
 */
export function lerpLatLng(a, b, t) {
    const u = Math.max(0, Math.min(1, t));
    return {
        lat: a.lat + (b.lat - a.lat) * u,
        lng: a.lng + (b.lng - a.lng) * u,
    };
}

/**
 * Rough walking ETA from distance (meters), ~1.4 m/s.
 * @param {number} meters
 * @returns {number} minutes, at least 1
 */
export function estimateWalkMinutes(meters) {
    if (!meters || meters <= 0) return 1;
    const mps = 1.4;
    return Math.max(1, Math.round(meters / mps / 60));
}
