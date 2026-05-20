export function formatCurrency(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatMatchScore(score: number): number {
  return Math.round(score * 100);
}

export function parseActivities(activities: string): string[] {
  return activities
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
}
