import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SmartImage from "./SmartImage";

describe("SmartImage", () => {
    it("shows the branded fallback immediately when no src is provided", () => {
        render(<SmartImage alt="no source" />);
        expect(screen.getByText("DineAir")).toBeInTheDocument();
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("renders the image while loading, then swaps to the fallback on error", () => {
        render(<SmartImage src="https://example.com/broken.jpg" alt="a dish" />);

        const img = screen.getByRole("img", { name: "a dish" });
        expect(img).toBeInTheDocument();
        expect(screen.queryByText("DineAir")).not.toBeInTheDocument();

        fireEvent.error(img);

        expect(screen.queryByRole("img")).not.toBeInTheDocument();
        expect(screen.getByText("DineAir")).toBeInTheDocument();
    });

    it("removes the loading shimmer once the image loads successfully", () => {
        render(<SmartImage src="https://example.com/good.jpg" alt="a dish" />);
        const img = screen.getByRole("img", { name: "a dish" });

        fireEvent.load(img);

        expect(img.className).toContain("opacity-100");
    });
});
