import { describe, expect, it } from "vitest";
import { formatHours, formatNaira, formatNairaShort, monthInitial, monthName } from "./format";

describe("format", () => {
  it("formats naira with grouping", () => {
    expect(formatNaira(150000)).toBe("₦150,000");
  });

  it("shortens large amounts", () => {
    expect(formatNairaShort(45_400)).toBe("₦45k");
    expect(formatNairaShort(1_250_000)).toBe("₦1.3m");
    expect(formatNairaShort(12_000_000)).toBe("₦12m");
    expect(formatNairaShort(800)).toBe("₦800");
  });

  it("names months", () => {
    expect(monthName(1)).toBe("January");
    expect(monthInitial(9)).toBe("S");
  });

  it("reads hours naturally", () => {
    expect(formatHours(0.4)).toBe("under an hour");
    expect(formatHours(1.2)).toBe("1 hr");
    expect(formatHours(4.6)).toBe("5 hrs");
  });
});
