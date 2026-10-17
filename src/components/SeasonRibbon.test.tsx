import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { seasonLevel } from "../lib/season";
import { SeasonRibbon } from "./SeasonRibbon";

const SAVANNA = [1, 1, 0.95, 0.7, 0.4, 0.3, 0.2, 0.2, 0.3, 0.6, 0.9, 1];

describe("SeasonRibbon", () => {
  it("classifies scores on the backend's boundaries", () => {
    expect(seasonLevel(0.8)).toBe("great");
    expect(seasonLevel(0.5)).toBe("fair");
    expect(seasonLevel(0.49)).toBe("wet");
  });

  it("describes best months and the travel month for screen readers", () => {
    render(<SeasonRibbon scores={SAVANNA} month={8} />);
    expect(
      screen.getByRole("img", {
        name: "Best months: January, February, March, November, December. August is a wet month.",
      })
    ).toBeInTheDocument();
  });

  it("says so when there's no climate data", () => {
    render(<SeasonRibbon scores={[]} />);
    expect(screen.getByText(/isn't available/)).toBeInTheDocument();
  });
});
