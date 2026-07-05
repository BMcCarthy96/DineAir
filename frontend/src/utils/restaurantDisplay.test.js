import { describe, expect, it } from "vitest";
import { formatRating } from "./restaurantDisplay";

describe("formatRating", () => {
    it("shows New when there are no reviews", () => {
        expect(formatRating(null, 0)).toBe("New");
        expect(formatRating(4.5, 0)).toBe("New");
    });

    it("shows New when avgRating is null even if reviewCount is missing", () => {
        expect(formatRating(null, undefined)).toBe("New");
    });

    it("formats a numeric rating to one decimal place", () => {
        expect(formatRating(4.5, 12)).toBe("4.5");
        expect(formatRating(4, 3)).toBe("4.0");
        expect(formatRating("3.777", 5)).toBe("3.8");
    });
});
