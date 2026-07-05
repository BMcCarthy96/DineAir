/** Real rating display — "New" when a restaurant has no reviews yet. */
export function formatRating(avgRating, reviewCount) {
    const count = Number(reviewCount) || 0;
    if (count === 0 || avgRating == null) return "New";
    return Number(avgRating).toFixed(1);
}
