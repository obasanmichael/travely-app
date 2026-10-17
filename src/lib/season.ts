export type SeasonLevel = "great" | "fair" | "wet";

// Mirrors the backend's fuzzy "ideal" and "poor" season boundaries.
export function seasonLevel(score: number): SeasonLevel {
  if (score >= 0.8) return "great";
  if (score >= 0.5) return "fair";
  return "wet";
}
