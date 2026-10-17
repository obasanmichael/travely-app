import { describe, expect, it } from "vitest";
import { DEFAULT_SEARCH } from "../search/searchState";
import { nothingFitsReason } from "./messages";

const search = { ...DEFAULT_SEARCH, budget: 120_000, days: 13, travellers: 2 };

describe("nothingFitsReason", () => {
  it("quotes the cheapest feasible trip", () => {
    expect(nothingFitsReason({ cheapest_feasible_budget: 210_000 }, search)).toMatch(/starts around ₦210,000/);
  });

  it("blames the budget when travel and food alone exceed it", () => {
    expect(nothingFitsReason({ cheapest_feasible_budget: null, cheapest_without_stay: 330_000 }, search)).toMatch(/at least ₦330,000/);
  });

  it("blames missing stay prices only when they're the real gap", () => {
    expect(nothingFitsReason({ cheapest_feasible_budget: null, cheapest_without_stay: 60_000 }, search)).toMatch(/haven't verified prices for places to stay/);
  });
});
