import React from "react";
import {
  MapPin,
  Tag,
  Cloud,
  Banknote,
  Calendar,
  Building2,
  UtensilsCrossed,
  Package,
  Activity,
} from "lucide-react";
import type { Recommendation } from "../types/types";
import {
  formatCurrency,
  formatMatchScore,
  parseActivities,
} from "../../lib/format";
import { Badge } from "../ui/Badge";

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank?: number;
}

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <span className="text-muted mt-0.5 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-muted font-medium">
        {label}
      </p>
      <p className="text-sm text-primary truncate">{value}</p>
    </div>
  </div>
);

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  rank,
}) => {
  const {
    destination,
    state,
    city,
    destination_type,
    activities,
    climate,
    avg_cost_per_day,
    best_season,
    accommodation_type,
    nearby_hotel,
    hotel_price_range,
    feeding_cost_range,
    necessities_range,
    budget_category,
    score,
  } = recommendation;

  const activityList = parseActivities(activities);
  const matchPercent = formatMatchScore(score);

  return (
    <article className="group flex flex-col bg-surface-raised border border-default rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:border-travel-300/50 dark:hover:border-travel-700/50 transition-all duration-300">
      <div className="relative h-28 bg-gradient-to-br from-travel-600 via-travel-700 to-travel-900 dark:from-travel-800 dark:via-travel-900 dark:to-slate-900 p-5 flex flex-col justify-between">
        {rank !== undefined && rank <= 3 && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-sm">
            #{rank} pick
          </span>
        )}
        <div className="flex items-start justify-between gap-3 mt-auto">
          <h3 className="text-lg font-bold text-white leading-tight">
            {destination}
          </h3>
          <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
            <span className="text-lg font-bold text-white leading-none">
              {matchPercent}%
            </span>
            <span className="text-[9px] text-white/80 uppercase tracking-wide">
              match
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-1 gap-3">
          <DetailRow
            icon={<MapPin className="w-4 h-4" />}
            label="Location"
            value={`${city}, ${state}`}
          />
          <DetailRow
            icon={<Tag className="w-4 h-4" />}
            label="Type"
            value={destination_type}
          />
          <DetailRow
            icon={<Cloud className="w-4 h-4" />}
            label="Climate"
            value={`${climate}`}
          />
        </div>

        <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-muted border border-subtle">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-travel-600 dark:text-travel-400" />
            <span className="text-sm font-semibold text-primary">
              ₦{formatCurrency(avg_cost_per_day)}
              <span className="text-muted font-normal">/day</span>
            </span>
          </div>
          <Badge variant="accent">{budget_category}</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-secondary">
          <Calendar className="w-4 h-4 text-muted shrink-0" />
          <span>Best season: {best_season}</span>
        </div>

        <div className="rounded-xl bg-surface-muted border border-subtle p-4 space-y-2.5">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">
            Cost breakdown
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-secondary flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-muted" />
              Feeding
            </span>
            <span className="font-medium text-primary">{feeding_cost_range}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-secondary flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-muted" />
              Necessities
            </span>
            <span className="font-medium text-primary">{necessities_range}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-muted" />
            Stay
          </p>
          <p className="text-sm text-secondary leading-snug">
            {nearby_hotel}{" "}
            <span className="text-muted">({accommodation_type})</span>
          </p>
          <p className="text-xs text-muted">{hotel_price_range}</p>
        </div>

        <div className="mt-auto pt-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <Activity className="w-3.5 h-3.5 text-muted" />
            Activities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activityList.length > 0 ? (
              activityList.map((activity, i) => (
                <Badge key={i} variant="default">
                  {activity}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted">None listed</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecommendationCard;
