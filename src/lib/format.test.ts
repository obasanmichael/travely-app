import { describe, expect, it } from "vitest";
import { formatCurrency, formatMatchScore, parseActivities } from "./format";

describe("format helpers", () => {
  it("groups thousands", () => {
    expect(formatCurrency(1234567)).toBe("1,234,567");
  });

  it("turns a 0–1 score into a whole percentage", () => {
    expect(formatMatchScore(0.876)).toBe(88);
  });

  it("splits activities and drops blanks", () => {
    expect(parseActivities("Hiking, , Boating ")).toEqual(["Hiking", "Boating"]);
  });
});
