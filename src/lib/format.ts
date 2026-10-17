const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthName(month: number): string {
  return MONTHS[month - 1] ?? "";
}

export function monthInitial(month: number): string {
  return monthName(month).charAt(0);
}

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

/** ₦45k / ₦1.2m: for tight spaces like the cost meter. */
export function formatNairaShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")}m`;
  }
  if (amount >= 1_000) return `₦${Math.round(amount / 1_000)}k`;
  return formatNaira(amount);
}

export function formatHours(hours: number): string {
  if (hours < 1) return "under an hour";
  const rounded = Math.round(hours);
  return `${rounded} hr${rounded === 1 ? "" : "s"}`;
}
