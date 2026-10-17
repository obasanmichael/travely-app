import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { budgetFit } from "../lib/budget";
import { CostMeter } from "./CostMeter";

describe("CostMeter", () => {
  it.each([
    [40_000, 60_000, 100_000, "within"],
    [80_000, 120_000, 100_000, "stretch"],
    [110_000, 150_000, 100_000, "over"],
  ] as const)("range %i–%i against %i is %s", (low, high, budget, fit) => {
    expect(budgetFit(low, high, budget)).toBe(fit);
  });

  it("explains the fit in words and draws the budget marker", () => {
    render(<CostMeter low={45_000} high={77_000} budget={150_000} />);
    expect(
      screen.getByRole("img", { name: "Estimated ₦45,000 to ₦77,000, which fits your budget of ₦150,000." })
    ).toBeInTheDocument();
    expect(screen.getByTestId("cost-range")).toHaveAttribute("data-fit", "within");
    expect(screen.getByText("₦45k–₦77k")).toBeInTheDocument();
  });
});
