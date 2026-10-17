import { useId, useState } from "react";
import type { RecommendationItem } from "../../api/client";
import { CostMeter } from "../../components/CostMeter";
import { SeasonRibbon } from "../../components/SeasonRibbon";
import { formatNaira } from "../../lib/format";

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
  const detailsId = useId();
  const { destination, cost } = item;
  const shown = item.reasons.filter((r) => r.kind !== "cost" && r.kind !== "confidence");

  return (
    <article
      aria-labelledby={`${detailsId}-title`}
      className="grid overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
    >
      <div className="relative bg-lagoon-wash">
        {destination.photo ? (
          <>
            <img
              src={destination.photo.url}
              alt=""
              loading={rank === 0 ? "eager" : "lazy"}
              className="aspect-[4/3] h-full w-full object-cover"
            />
            <a
              href={destination.photo.file_page_url}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2 left-2 max-w-[90%] truncate rounded bg-ink/70 px-2 py-0.5 text-[11px] text-white"
            >
              Photo: {destination.photo.author}, {destination.photo.licence}
            </a>
          </>
        ) : (
          <div className="flex aspect-[4/3] h-full items-end p-4 text-sm text-ink-soft">No photo yet</div>
        )}
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <header>
          <h2 id={`${detailsId}-title`} className="m-0 text-2xl font-bold leading-tight tracking-tight text-ink">
            {destination.name}
          </h2>
          <p className="m-0 mt-1 text-sm text-ink-soft">{destination.state}</p>
        </header>

        <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px] text-ink">
          {shown.map((reason) => (
            <li key={reason.kind}>{reason.text}</li>
          ))}
        </ul>

        <SeasonRibbon scores={destination.month_scores} month={month} />
        <CostMeter low={cost.total.low} high={cost.total.high} budget={budget} />

        <div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((v) => !v)}
            className="text-sm font-semibold text-lagoon underline underline-offset-4"
          >
            {open ? "Hide the estimate" : "How we estimated this"}
          </button>
          {open && (
            <div id={detailsId} className="mt-4">
              <dl className="m-0 grid gap-3">
                {cost.components.map((component) => (
                  <div key={component.name} className="grid grid-cols-[1fr_auto] gap-x-4">
                    <dt className="text-sm font-semibold text-ink">{COMPONENT_LABELS[component.name] ?? component.name}</dt>
                    <dd className="m-0 text-right text-sm font-semibold tabular-nums text-ink">
                      {component.low === component.high
                        ? formatNaira(component.low)
                        : `${formatNaira(component.low)}–${formatNaira(component.high)}`}
                    </dd>
                    <dd className="col-span-2 m-0 text-[13px] text-ink-soft">
                      {component.basis}
                      {component.observed_on ? `. Prices from ${new Date(component.observed_on).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 mt-4 text-[13px] text-ink-soft">
                Estimate confidence: <strong className="text-ink">{cost.confidence}</strong>. These are estimates from
                published price data, not quotes. {destination.wikipedia_url && (
                  <a href={destination.wikipedia_url} target="_blank" rel="noreferrer" className="text-lagoon underline">
                    Read about {destination.name}
                  </a>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
