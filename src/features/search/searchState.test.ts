import { describe, expect, it } from "vitest";
import { DEFAULT_SEARCH, fromParams, fromRequest, toParams, toRequest, validate, type SearchState } from "./searchState";

const SEARCH: SearchState = {
  ...DEFAULT_SEARCH,
  origin: "NG-OY",
  budget: 250_000,
  days: 4,
  travellers: 2,
  month: 12,
  tier: "budget",
  interests: { hiking: "love", waterfalls: "like" },
  withChildren: true,
  maxHours: 6,
};

describe("searchState", () => {
  it("round-trips through the URL", () => {
    const { state, key } = fromParams(toParams(SEARCH, "abc12345"));
    expect(state).toEqual(SEARCH);
    expect(key).toBe("abc12345");
  });

  it("falls back to defaults for tampered values", () => {
    const { state, key } = fromParams(
      new URLSearchParams("from=Lagos&budget=-5&days=99&tier=luxury&love=hiking:adore&k=bad key")
    );
    expect(state.origin).toBe(DEFAULT_SEARCH.origin);
    expect(state.budget).toBe(DEFAULT_SEARCH.budget);
    expect(state.days).toBe(DEFAULT_SEARCH.days);
    expect(state.tier).toBe(DEFAULT_SEARCH.tier);
    expect(state.interests).toEqual({});
    expect(key).toBeNull();
  });

  it("explains every fixable problem", () => {
    const problems = validate({ ...SEARCH, budget: 0, days: 0, interests: Object.fromEntries(
      Array.from({ length: 9 }, (_, i) => [`t${i}`, "like" as const])
    ) });
    expect(problems).toHaveLength(3);
    expect(problems[0]).toMatch(/budget/);
  });

  it("maps to the API request", () => {
    expect(toRequest(SEARCH)).toMatchObject({
      origin_state: "NG-OY",
      budget: 250_000,
      month: 12,
      with_children: true,
      max_travel_hours: 6,
    });
  });

  it("rebuilds quiz answers from a stored request, ignoring junk", () => {
    expect(fromRequest(toRequest(SEARCH) as unknown as Record<string, unknown>)).toEqual(SEARCH);
    const state = fromRequest({ origin_state: "Lagos", budget: "lots", tier: "gold", interests: { hiking: "adore", food: "like" } });
    expect(state.origin).toBe(DEFAULT_SEARCH.origin);
    expect(state.budget).toBe(DEFAULT_SEARCH.budget);
    expect(state.tier).toBe(DEFAULT_SEARCH.tier);
    expect(state.interests).toEqual({ food: "like" });
  });
});
