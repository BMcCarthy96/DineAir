import { describe, expect, it } from "vitest";
import { estimateWalkMinutes, haversineMeters } from "./geo";

describe("haversineMeters", () => {
    it("returns 0 for identical points", () => {
        const point = { lat: 33.9425, lng: -118.408 };
        expect(haversineMeters(point, point)).toBeCloseTo(0, 5);
    });

    it("returns 0 when either point is missing", () => {
        expect(haversineMeters(null, { lat: 1, lng: 1 })).toBe(0);
        expect(haversineMeters({ lat: 1, lng: 1 }, undefined)).toBe(0);
    });

    it("computes a plausible distance between two known LAX-area coordinates", () => {
        const a = { lat: 33.9425, lng: -118.408 };
        const b = { lat: 33.9438, lng: -118.4079 };
        const meters = haversineMeters(a, b);
        expect(meters).toBeGreaterThan(100);
        expect(meters).toBeLessThan(300);
    });
});

describe("estimateWalkMinutes", () => {
    it("returns at least 1 minute for zero or negative distance", () => {
        expect(estimateWalkMinutes(0)).toBe(1);
        expect(estimateWalkMinutes(-50)).toBe(1);
    });

    it("scales roughly with distance at ~1.4 m/s", () => {
        expect(estimateWalkMinutes(84)).toBe(1);
        expect(estimateWalkMinutes(840)).toBe(10);
    });
});
