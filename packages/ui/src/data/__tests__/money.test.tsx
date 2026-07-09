import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Money } from "../money";

describe("Money", () => {
  it("formats minor units as naira", () => {
    render(<Money value="4800000" />);
    expect(screen.getByText("₦48,000.00")).toBeInTheDocument();
  });

  it("prefixes a + for positive signed amounts", () => {
    render(<Money value="250000" signed />);
    expect(screen.getByText("+₦2,500.00")).toBeInTheDocument();
  });

  it("colorizes a negative (debit) amount with the destructive token", () => {
    const { container } = render(<Money value="-250000" colorize />);
    const span = container.querySelector("span");
    expect(span?.className).toContain("text-destructive");
    expect(span?.textContent).toBe("-₦2,500.00");
  });
});
