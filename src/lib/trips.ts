import { formatNaira, monthName } from "./format";

export type TripInputs = { budget: number; days: number; travellers: number; month?: number | null };

export function describeTrip(inputs: TripInputs): string {
  const days = inputs.days === 1 ? "A day trip" : `${inputs.days} days`;
  const who = inputs.travellers === 1 ? "1 person" : `${inputs.travellers} people`;
  return `${formatNaira(inputs.budget)}, ${days}, ${who}${inputs.month ? `, ${monthName(inputs.month)}` : ""}`;
}
