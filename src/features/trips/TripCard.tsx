import { motion, useReducedMotion } from "motion/react";
import type { RecommendationItem } from "../../api/client";
import { CostMeter } from "../../components/CostMeter";
import { SaveButton } from "../../components/SaveButton";
import { SeasonRibbon } from "../../components/SeasonRibbon";
import { Badge } from "../../ui/Badge";
import { Reveal } from "../../ui/Reveal";

interface TripCardProps {
  item: RecommendationItem;
  budget: number;
  month: number | null;
  rank: number;
  index: number;
  onOpen: () => void;
}

export function TripCard({ item, budget, month, rank, index, onOpen }: TripCardProps) {
  const reduce = useReducedMotion();
  const { destination, cost } = item;
  const stayUnverified = (cost.missing ?? []).includes("accommodation");
  const why = item.reasons.find((r) => r.kind === "interests") ?? item.reasons.find((r) => r.kind === "season");
  return (
    <Reveal index={index} className="h-full">
      <motion.article
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-shadow duration-300 hover:shadow-lift"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-primary-wash">
          {destination.photo && (
            <img
              src={destination.photo.url}
              alt=""
              loading={index < 3 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-night/20" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            {rank === 0 && !stayUnverified ? <Badge tone="sun">Best match</Badge> : <span />}
            <div className="relative z-10">
              <SaveButton destinationId={destination.id} name={destination.name} tone="dark" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <h3 className="m-0 text-xl font-bold leading-tight">
              <button type="button" onClick={onOpen} className="text-left text-white after:absolute after:inset-0 after:z-0" aria-label={`View details for ${destination.name}`}>
                {destination.name}
              </button>
            </h3>
            <p className="m-0 text-sm text-white/80">{destination.state}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5">
          {why && <p className="m-0 text-[15px] text-ink">{why.text}</p>}
          <SeasonRibbon scores={destination.month_scores} month={month} animate />
          <div className="mt-auto">
            <CostMeter low={cost.total.low} high={cost.total.high} budget={budget} />
            {stayUnverified && <p className="m-0 mt-2 text-[13px] text-muted">Plus a place to stay. Its price isn't verified yet.</p>}
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}
