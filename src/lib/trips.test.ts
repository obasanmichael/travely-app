import { describe, expect, it } from "vitest";
import { describeTrip } from "./trips";

describe("describeTrip", () => {
  it("summarises a trip in plain words", () => {
    expect(describeTrip({ budget: 150000, days: 3, travellers: 2, month: 12 })).toBe("₦150,000, 3 days, 2 people, December");
    expect(describeTrip({ budget: 90000, days: 1, travellers: 1 })).toBe("₦90,000, A day trip, 1 person");
  });
});
