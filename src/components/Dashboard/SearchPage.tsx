import { Compass, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchDestinations } from "../../services/destinationService";
import type { DestinationSummary } from "../types/types";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { formatCurrency } from "../../lib/format";
import { Badge } from "../ui/Badge";

const DESTINATION_TYPES = ["nature", "cultural", "historical", "urban leisure", "beach"];
const BUDGET_BANDS = [
  { value: "", label: "Any budget" },
  { value: "low", label: "Low (≤ ₦12k/day)" },
  { value: "medium", label: "Medium (₦12k–25k/day)" },
  { value: "high", label: "High (> ₦25k/day)" },
] as const;

const SearchPage = () => {
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [allStates, setAllStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");

  useEffect(() => {
    fetchDestinations()
      .then((all) => {
        setAllStates([...new Set(all.map((d) => d.state))].sort());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const results = await fetchDestinations({
          q: query || undefined,
          state: stateFilter || undefined,
          destination_type: typeFilter || undefined,
          budget_band: budgetFilter
            ? (budgetFilter as "low" | "medium" | "high")
            : undefined,
        });
        if (!cancelled) setDestinations(results);
      } catch (error) {
        console.error("Explore load failed:", error);
        if (!cancelled) toast.error("Failed to load destinations.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = setTimeout(load, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, stateFilter, typeFilter, budgetFilter]);

  const states = allStates;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-6 h-6 text-travel-600 dark:text-travel-400" />
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Explore destinations
          </h1>
        </div>
        <p className="text-sm text-secondary">
          Browse the Travely catalog by state, type, and budget band.
        </p>
      </div>

      <Card padding="md" className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, or state…"
            className="w-full rounded-xl border border-default bg-surface-raised pl-10 pr-4 py-3 text-primary outline-none focus:border-travel-500 focus:ring-4 focus:ring-travel-500/10"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-sm text-primary"
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-sm text-primary"
          >
            <option value="">All types</option>
            {DESTINATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="rounded-xl border border-default bg-surface-raised px-3 py-2.5 text-sm text-primary"
          >
            {BUDGET_BANDS.map((band) => (
              <option key={band.label} value={band.value}>
                {band.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : destinations.length === 0 ? (
        <Card className="text-center" padding="lg">
          <MapPin className="w-10 h-10 mx-auto text-muted mb-3" />
          <p className="text-secondary">No destinations match your filters.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <Card key={`${dest.destination}-${dest.city}`} padding="md" className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-primary">{dest.destination}</h2>
                  <p className="text-sm text-secondary">
                    {dest.city}, {dest.state}
                  </p>
                </div>
                <Badge variant="accent">{dest.budget_category}</Badge>
              </div>
              <p className="text-sm text-secondary capitalize">{dest.destination_type}</p>
              <p className="text-sm text-muted line-clamp-2">{dest.activities}</p>
              <p className="text-sm font-medium text-primary">
                From ₦{formatCurrency(Math.round(dest.avg_cost_per_day))}/day
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
