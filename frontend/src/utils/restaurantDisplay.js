/** Client-side display helpers when API has no aggregated rating / ETA. */

export function displayRating(restaurantId) {
    const n = Number(restaurantId) || 0;
    return (4 + (n % 9) / 10).toFixed(1);
}

export function estimatedDeliveryRange(restaurantId) {
    const n = Number(restaurantId) || 0;
    const low = 12 + (n % 5);
    return `${low}–${low + 8} min`;
}

export function isFastPrepRestaurant(restaurantId, fastPrepIds = [4, 5, 9, 10]) {
    return fastPrepIds.includes(Number(restaurantId));
}
