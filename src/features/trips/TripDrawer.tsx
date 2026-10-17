import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { RecommendationItem } from "../../api/client";
import { CostMeter } from "../../components/CostMeter";
import { SaveButton } from "../../components/SaveButton";
import { SeasonRibbon } from "../../components/SeasonRibbon";
import { monthName } from "../../lib/format";
import { Badge } from "../../ui/Badge";
import { Drawer } from "../../ui/Drawer";
import { amountLabel } from "../results/costLabels";

const COMPONENT_LABELS: Record<string, string> = {
  intercity_transport: "Getting there and back",
  local_transport: "Getting around",
  food: "Food",
  accommodation: "Where to stay",
  entry_fees: "Entry fees",
};

interface TripDrawerProps {
  item: RecommendationItem | null;
  budget: number;
  month: number | null;
  onClose: () => void;
}

export function TripDrawer({ item, budget, month, onClose }: TripDrawerProps) {
  return (
    <Drawer open={item !== null} onOpenChange={(open) => !open && onClose()} title={item?.destination.name ?? "Place"} description={item?.destination.state}>
      {item && <Body item={item} budget={budget} month={month} />}
    </Drawer>
  );
}

function Body({ item, budget, month }: { item: RecommendationItem; budget: number; month: number | null }) {
  const { destination, cost } = item;
  const stayUnverified = (cost.missing ?? []).includes("accommodation");
  const reasons = item.reasons.filter((r) => r.kind !== "confidence");
  return (
    <div className="flex flex-col gap-8 p-6">
      {destination.photo && (
        <figure className="m-0">
          <img src={destination.photo.url} alt="" className="aspect-[16/10] w-full rounded-2xl object-cover" />
          <figcaption className="mt-2 text-[12px] text-muted">
            <a href={destination.photo.file_page_url} target="_blank" rel="noreferrer" className="underline">
              Photo: {destination.photo.author}, {destination.photo.licence}
            </a>
          </figcaption>
        </figure>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SaveButton destinationId={destination.id} name={destination.name} />
        <Link to={`/app/places/${destination.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Open place page <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <section aria-labelledby="why-title">
        <h3 id="why-title" className="m-0 text-base font-bold text-ink">
          Why it fits
        </h3>
        <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0 text-[15px] text-ink">
          {reasons.map((reason) => (
            <li key={reason.kind} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {reason.text}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="when-title">
        <h3 id="when-title" className="m-0 mb-4 text-base font-bold text-ink">
          When to go
        </h3>
        <SeasonRibbon scores={destination.month_scores} month={month} interactive size="lg" />
        {destination.best_months.length > 0 && (
          <p className="m-0 mt-3 text-sm text-muted">
            <strong className="text-ink">Best: </strong>
            {destination.best_months.map(monthName).join(", ")}
          </p>
        )}
      </section>

      <section aria-labelledby="cost-title">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 id="cost-title" className="m-0 text-base font-bold text-ink">
            What it costs
          </h3>
          <Badge tone={cost.confidence === "high" ? "primary" : cost.confidence === "medium" ? "neutral" : "danger"}>{cost.confidence} confidence</Badge>
        </div>
        <CostMeter low={cost.total.low} high={cost.total.high} budget={budget} />
        <dl className="m-0 mt-6 grid gap-4">
          {cost.components.map((component) => (
            <div key={component.name} className="grid grid-cols-[1fr_auto] gap-x-4">
              <dt className="text-sm font-semibold text-ink">{COMPONENT_LABELS[component.name] ?? component.name}</dt>
              <dd className="m-0 text-right text-sm font-semibold tabular-nums text-ink">{amountLabel(component)}</dd>
              <dd className="col-span-2 m-0 text-[13px] text-muted">
                {component.basis}
                {component.observed_on ? `. Prices from ${new Date(component.observed_on).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}` : ""}
              </dd>
            </div>
          ))}
          {stayUnverified && (
            <div className="grid grid-cols-[1fr_auto] gap-x-4">
              <dt className="text-sm font-semibold text-ink">Where to stay</dt>
              <dd className="m-0 text-right text-sm font-semibold text-ink">Not verified yet</dd>
              <dd className="col-span-2 m-0 text-[13px] text-muted">Budget for this on top of the total above.</dd>
            </div>
          )}
        </dl>
        <p className="m-0 mt-5 text-[13px] text-muted">Estimates from published price data, not quotes.</p>
      </section>
    </div>
  );
}
