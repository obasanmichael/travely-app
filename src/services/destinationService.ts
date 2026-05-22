import { apiFetch } from "../api/client";
import type { DestinationSummary, ExploreFilters } from "../components/types/types";

export async function fetchDestinations(
  filters: ExploreFilters = {}
): Promise<DestinationSummary[]> {
  const params = new URLSearchParams();
  if (filters.state) params.set("state", filters.state);
  if (filters.destination_type) params.set("destination_type", filters.destination_type);
  if (filters.budget_band) params.set("budget_band", filters.budget_band);
  if (filters.q) params.set("q", filters.q);

  const query = params.toString();
  const path = query ? `/destinations?${query}` : "/destinations";
  return apiFetch<DestinationSummary[]>(path);
}
