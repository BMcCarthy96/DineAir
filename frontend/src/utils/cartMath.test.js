import { describe, expect, it } from "vitest";
import { computeCartTotals, formatMoney } from "./cartMath";

describe("computeCartTotals", () => {
    it("returns all zeros for an empty cart", () => {
        const totals = computeCartTotals([]);
        expect(totals).toEqual({ subtotal: 0, taxEstimate: 0, serviceFee: 0, total: 0 });
    });

    it("sums quantity * price across items and applies tax + service fee", () => {
        const cartItems = [
            { quantity: 2, MenuItem: { price: "10.00" } },
            { quantity: 1, MenuItem: { price: "5.50" } },
        ];
        const totals = computeCartTotals(cartItems);

        expect(totals.subtotal).toBeCloseTo(25.5, 5);
        expect(totals.taxEstimate).toBeCloseTo(25.5 * 0.0825, 5);
        expect(totals.serviceFee).toBe(2.49);
        expect(totals.total).toBeCloseTo(25.5 + 25.5 * 0.0825 + 2.49, 5);
    });

    it("treats a missing MenuItem price as zero instead of crashing", () => {
        const totals = computeCartTotals([{ quantity: 3, MenuItem: null }]);
        expect(totals.subtotal).toBe(0);
        expect(totals.serviceFee).toBe(2.49);
    });
});

describe("formatMoney", () => {
    it("formats to two decimal places", () => {
        expect(formatMoney(5)).toBe("5.00");
        expect(formatMoney(5.006)).toBe("5.01");
    });

    it("falls back to 0.00 for NaN", () => {
        expect(formatMoney(NaN)).toBe("0.00");
    });
});
