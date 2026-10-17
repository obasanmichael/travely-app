export type Fit = "within" | "stretch" | "over";

export function budgetFit(low: number, high: number, budget: number): Fit {
  if (high <= budget) return "within";
  if (low <= budget) return "stretch";
  return "over";
}
