import type { RecommendationRequest } from "../../api/client";

export type Level = "love" | "like";
export type Tier = "budget" | "mid" | "premium";
export type Pace = "relaxed" | "balanced" | "packed";

export interface SearchState {
  origin: string;
  budget: number;
  days: number;
  travellers: number;
  month: number | null;
  tier: Tier;
  interests: Record<string, Level>;
  pace: Pace;
  withChildren: boolean;
  maxHours: number | null;
}

export const DEFAULT_SEARCH: SearchState = {
  origin: "NG-LA",
  budget: 150_000,
  days: 3,
  travellers: 1,
  month: null,
  tier: "mid",
  interests: {},
  pace: "balanced",
  withChildren: false,
  maxHours: null,
};

export const LIMITS = {
  budget: { min: 1_000, max: 1_000_000_000 },
  days: { min: 1, max: 30 },
  travellers: { min: 1, max: 20 },
  interests: 8,
} as const;

const TIERS: Tier[] = ["budget", "mid", "premium"];
const PACES: Pace[] = ["relaxed", "balanced", "packed"];

function intIn(value: string | null, min: number, max: number): number | null {
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return null;
  return parsed;
}

/** Problems a user can fix, in their words. Empty when the search can run. */
export function validate(state: SearchState): string[] {
  const problems: string[] = [];
  if (!/^NG-[A-Z]{2}$/.test(state.origin)) problems.push("Choose where you're starting from.");
  if (!Number.isFinite(state.budget) || state.budget < LIMITS.budget.min) {
    problems.push(`Enter a budget of at least ₦${LIMITS.budget.min.toLocaleString("en-NG")}.`);
  }
  if (state.days < LIMITS.days.min || state.days > LIMITS.days.max) {
    problems.push(`Trips can be ${LIMITS.days.min} to ${LIMITS.days.max} days.`);
  }
  if (state.travellers < LIMITS.travellers.min || state.travellers > LIMITS.travellers.max) {
    problems.push(`Travellers must be between ${LIMITS.travellers.min} and ${LIMITS.travellers.max}.`);
  }
  if (Object.keys(state.interests).length > LIMITS.interests) {
    problems.push(`Pick up to ${LIMITS.interests} interests.`);
  }
  return problems;
}

export function toParams(state: SearchState, key: string): URLSearchParams {
  const params = new URLSearchParams({
    from: state.origin,
    budget: String(Math.round(state.budget)),
    days: String(state.days),
    people: String(state.travellers),
    tier: state.tier,
    pace: state.pace,
    k: key,
  });
  if (state.month) params.set("month", String(state.month));
  if (state.withChildren) params.set("kids", "1");
  if (state.maxHours) params.set("maxh", String(state.maxHours));
  const interests = Object.entries(state.interests).map(([slug, level]) => `${slug}:${level}`);
  if (interests.length) params.set("love", interests.join(","));
  return params;
}

/** Read a search from the URL; anything missing or malformed falls back to defaults. */
export function fromParams(params: URLSearchParams): { state: SearchState; key: string | null } {
  const interests: Record<string, Level> = {};
  for (const pair of (params.get("love") ?? "").split(",").filter(Boolean)) {
    const [slug, level] = pair.split(":");
    if (slug && (level === "love" || level === "like")) interests[slug] = level;
  }
  const origin = params.get("from") ?? "";
  const tier = params.get("tier") as Tier;
  const pace = params.get("pace") as Pace;
  const key = params.get("k");
  return {
    state: {
      origin: /^NG-[A-Z]{2}$/.test(origin) ? origin : DEFAULT_SEARCH.origin,
      budget: intIn(params.get("budget"), LIMITS.budget.min, LIMITS.budget.max) ?? DEFAULT_SEARCH.budget,
      days: intIn(params.get("days"), LIMITS.days.min, LIMITS.days.max) ?? DEFAULT_SEARCH.days,
      travellers:
        intIn(params.get("people"), LIMITS.travellers.min, LIMITS.travellers.max) ?? DEFAULT_SEARCH.travellers,
      month: intIn(params.get("month"), 1, 12),
      tier: TIERS.includes(tier) ? tier : DEFAULT_SEARCH.tier,
      interests,
      pace: PACES.includes(pace) ? pace : DEFAULT_SEARCH.pace,
      withChildren: params.get("kids") === "1",
      maxHours: intIn(params.get("maxh"), 1, 24),
    },
    key: key && /^[A-Za-z0-9_-]{8,100}$/.test(key) ? key : null,
  };
}

export function toRequest(state: SearchState): RecommendationRequest {
  return {
    origin_state: state.origin,
    budget: state.budget,
    days: state.days,
    travellers: state.travellers,
    month: state.month,
    tier: state.tier,
    interests: state.interests,
    pace: state.pace,
    with_children: state.withChildren,
    max_travel_hours: state.maxHours,
    limit: 6,
  };
}

export function newSearchKey(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

/** Rebuild the quiz answers from a stored trip's request, so "Edit trip" starts from what was asked. */
export function fromRequest(input: Record<string, unknown>): SearchState {
  const interests: Record<string, Level> = {};
  for (const [slug, level] of Object.entries((input.interests as Record<string, unknown>) ?? {})) {
    if (level === "love" || level === "like") interests[slug] = level;
  }
  const num = (value: unknown, fallback: number) => (typeof value === "number" && Number.isFinite(value) ? value : fallback);
  const tier = input.tier as Tier;
  const pace = input.pace as Pace;
  return {
    origin: typeof input.origin_state === "string" && /^NG-[A-Z]{2}$/.test(input.origin_state) ? input.origin_state : DEFAULT_SEARCH.origin,
    budget: num(input.budget, DEFAULT_SEARCH.budget),
    days: num(input.days, DEFAULT_SEARCH.days),
    travellers: num(input.travellers, DEFAULT_SEARCH.travellers),
    month: typeof input.month === "number" ? input.month : null,
    tier: TIERS.includes(tier) ? tier : DEFAULT_SEARCH.tier,
    interests,
    pace: PACES.includes(pace) ? pace : DEFAULT_SEARCH.pace,
    withChildren: input.with_children === true,
    maxHours: typeof input.max_travel_hours === "number" ? input.max_travel_hours : null,
  };
}
