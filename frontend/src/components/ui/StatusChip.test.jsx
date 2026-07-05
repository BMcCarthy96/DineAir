import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatusChip from "./StatusChip";

describe("StatusChip", () => {
    it.each([
        ["pending", "Pending"],
        ["preparing", "Preparing"],
        ["picked_up", "Picked up"],
        ["on_the_way", "On the way"],
        ["delivered", "Delivered"],
    ])("maps status %s to label %s", (status, label) => {
        render(<StatusChip status={status} />);
        expect(screen.getByText(label)).toBeInTheDocument();
    });

    it("falls back to a humanized label for an unknown status", () => {
        render(<StatusChip status="some_weird_status" />);
        expect(screen.getByText("some weird status")).toBeInTheDocument();
    });

    it("renders Unknown when status is missing entirely", () => {
        render(<StatusChip status={undefined} />);
        expect(screen.getByText("Unknown")).toBeInTheDocument();
    });
});
