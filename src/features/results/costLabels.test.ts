import { describe, expect, it } from "vitest";
import { amountLabel } from "./costLabels";

const base = { basis: "", observed_on: null };

describe("amountLabel", () => {
  it("never shows an unverified entry fee as free", () => {
    expect(amountLabel({ ...base, name: "entry_fees", low: 0, high: 0, confidence: "low" })).toBe("Not verified yet");
  });

  it("shows a real zero (e.g. no travel within the same state)", () => {
    expect(amountLabel({ ...base, name: "intercity_transport", low: 0, high: 0, confidence: "high" })).toBe("₦0");
  });

  it("shows ranges", () => {
    expect(amountLabel({ ...base, name: "food", low: 13266, high: 19900, confidence: "medium" })).toBe("₦13,266–₦19,900");
  });
});
