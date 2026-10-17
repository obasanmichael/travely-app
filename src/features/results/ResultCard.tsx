import { useId, useState } from "react";
import { Link } from "react-router-dom";
import type { RecommendationItem } from "../../api/client";
import { CostMeter } from "../../components/CostMeter";
import { SaveButton } from "../../components/SaveButton";
import { SeasonRibbon } from "../../components/SeasonRibbon";
import { amountLabel } from "./costLabels";

const COMPONENT_LABELS: Record<string, string> = {
  intercity_transport: "Getting there and back",
  local_transport: "Getting around",
  food: "Food",
  accommodation: "Where to stay",
  entry_fees: "Entry fees",
};

interface ResultCardProps {
  item: RecommendationItem;
  budget: number;
  month: number | null;
  rank: number;
}

export function ResultCard({ item, budget, month, rank }: ResultCardProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { destination, cost } = item;
  const stayUnverified = (cost.missing ?? []).includes("accommodation");
  const reasons = item.reasons.filter((r) => r.kind !== "confidence" && (r.kind !== "cost" || stayUnverified));

  return (
    <article aria-labelledby={`${id}-title`} className="overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
      <div className="relative bg-lagoon-wash">
        {destination.photo ? (
          <img
            src={destination.photo.url}
            alt=""
            loading={rank === 0 ? "eager" : "lazy"}
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div className="aspect-[16/9] w-full" />
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {rank === 0 && !stayUnverified ? (
            <span className="rounded-full bg-sun px-3 py-1 text-xs font-bold text-ink">Best match</span>
          ) : (
            <span />
          )}
          <SaveButton destinationId={destination.id} name={destination.name} tone="dark" />
        </div>
        {destination.photo && (
          <a
            href={destination.photo.file_page_url}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-2 right-3 max-w-[70%] truncate rounded bg-ink/60 px-2 py-0.5 text-[11px] text-white"
          >
            Photo: {destination.photo.author}, {destination.photo.licence}
          </a>
        )}
      </div>

      <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <header>
            <h2 id={`${id}-title`} className="m-0 text-2xl font-bold leading-tight tracking-tight">
              <Link to={`/places/${destination.slug}`} className="text-ink no-underline hover:underline">
                {destination.name}
              </Link>
            </h2>
            <p className="m-0 mt-1 text-sm text-ink-soft">{destination.state}</p>
          </header>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px] text-ink">
            {reasons.map((reason) => (
              <li key={reason.kind} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lagoon" />
                {reason.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <SeasonRibbon scores={destination.month_scores} month={month} animate />
          {stayUnverified ? (
            <div>
              <CostMeter low={cost.total.low} high={cost.total.high} budget={budget} />
              <p className="m-0 mt-2 text-[13px] text-ink-soft">Plus a place to stay. Its price isn't verified yet.</p>
            </div>
          ) : (
            <CostMeter low={cost.total.low} high={cost.total.high} budget={budget} />
          )}
          <div>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`${id}-details`}
              onClick={() => setOpen((v) => !v)}
              className="text-sm font-semibold text-lagoon underline underline-offset-4"
            >
              {open ? "Hide the estimate" : "How we estimated this"}
            </button>
            {open && (
              <div id={`${id}-details`} className="mt-4">
                <dl className="m-0 grid gap-3">
                  {cost.components.map((component) => (
                    <div key={component.name} className="grid grid-cols-[1fr_auto] gap-x-4">
                      <dt className="text-sm font-semibold text-ink">{COMPONENT_LABELS[component.name] ?? component.name}</dt>
                      <dd className="m-0 text-right text-sm font-semibold tabular-nums text-ink">{amountLabel(component)}</dd>
                      <dd className="col-span-2 m-0 text-[13px] text-ink-soft">
                        {component.basis}
                        {component.observed_on
                          ? `. Prices from ${new Date(component.observed_on).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`
                          : ""}
                      </dd>
                    </div>
                  ))}
                  {stayUnverified && (
                    <div className="grid grid-cols-[1fr_auto] gap-x-4">
                      <dt className="text-sm font-semibold text-ink">Where to stay</dt>
                      <dd className="m-0 text-right text-sm font-semibold text-ink">Not verified yet</dd>
                    </div>
                  )}
                </dl>
                <p className="m-0 mt-4 text-[13px] text-ink-soft">
                  Estimate confidence: <strong className="text-ink">{cost.confidence}</strong>. Estimates from published
                  price data, not quotes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
