import { formatNaira } from "../../lib/format";
import type { SearchState } from "../search/searchState";

export function nothingFitsReason(
  data: { cheapest_feasible_budget: number | null; cheapest_without_stay?: number | null },
  search: SearchState
): string {
  if (data.cheapest_feasible_budget) {
    return `The cheapest trip like this starts around ${formatNaira(data.cheapest_feasible_budget)}. Try a bigger budget, fewer days or fewer travellers.`;
  }
  const beforeStay = data.cheapest_without_stay;
  if (beforeStay && beforeStay > search.budget) {
    return `Even before a place to stay, getting there, getting around and food for this trip come to at least ${formatNaira(beforeStay)}. Try a bigger budget, fewer days, fewer travellers or a cheaper comfort level.`;
  }
  return "We haven't verified prices for places to stay yet, so overnight trips can't be planned right now. Day trips are fully priced.";
}
