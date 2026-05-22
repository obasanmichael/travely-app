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

export function formatRunDate(value: unknown): string {
  if (!value) return "Unknown date";
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  if (value instanceof Date) {
    return value.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  return String(value);
}
