import type { Meta, RecommendationItem, RecommendationResponse } from "../api/client";

export const META: Meta = {
  states: [
    { iso: "NG-LA", name: "Lagos" },
    { iso: "NG-OS", name: "Osun" },
  ],
  interests: [
    { slug: "hiking", label: "Hiking", category: "activity", description: "Trails" },
    { slug: "waterfalls", label: "Waterfalls", category: "nature", description: "Falls" },
  ],
  tiers: ["budget", "mid", "premium"],
  paces: ["relaxed", "balanced", "packed"],
  catalog_size: 2,
  catalog_version: 1,
};

export const ITEM: RecommendationItem = {
  destination: {
    id: "d1",
    slug: "erin-ijesha-waterfalls",
    name: "Erin-Ijesha Waterfalls",
    state: "Osun",
    state_iso: "NG-OS",
    latitude: 7.6,
    longitude: 4.87,
    description: "Seven-tier falls",
    wikipedia_url: "https://en.wikipedia.org/wiki/Erin-Ijesha_Waterfalls",
    photo: { url: "https://x/1280.jpg", file_page_url: "https://c/File", author: "Ada", licence: "CC BY-SA 4.0" },
    tags: ["waterfalls", "hiking"],
    best_months: [11, 12, 1],
    month_scores: [1, 0.95, 0.85, 0.6, 0.4, 0.3, 0.2, 0.3, 0.3, 0.6, 0.9, 1],
  },
  score: 0.78,
  match: 0.81,
  practicality: 0.8,
  season_fit: 1,
  matched_interests: ["waterfalls"],
  cost: {
    total: { low: 45_000, high: 77_000 },
    confidence: "medium",
    missing: [],
    components: [
      { name: "food", low: 10_000, high: 20_000, confidence: "medium", basis: "NBS zonal food prices", observed_on: "2026-05-01" },
    ],
    road_km: 220,
    travel_hours: 4,
  },
  reasons: [
    { kind: "interests", text: "Matches your interest in waterfalls" },
    { kind: "cost", text: "About ₦89,000 under your budget" },
    { kind: "travel", text: "About 4 hrs by road from Lagos" },
  ],
};

export function response(overrides: Partial<RecommendationResponse> = {}): RecommendationResponse {
  return {
    run_id: "run-1",
    engine_version: "3.0.0",
    catalog_version: 1,
    budget_band: "Medium",
    relaxed: [],
    exclusions: { over_budget: 0, too_far: 0, cost_unknown: 0 },
    considered: 2,
    cheapest_feasible_budget: 45_000,
    notes: [],
    recommendations: [ITEM],
    unverified_stays: [],
    ...overrides,
  };
}
