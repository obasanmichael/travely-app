import { budgetFit, type Fit } from "../lib/budget";
import { formatNaira, formatNairaShort } from "../lib/format";

interface CostMeterProps {
  low: number;
  high: number;
  budget: number;
}


const RANGE_CLASS: Record<Fit, string> = {
  within: "bg-primary",
  stretch: "bg-sun",
  over: "bg-danger",
};

const SUMMARY: Record<Fit, string> = {
  within: "fits your budget",
  stretch: "may go over your budget at the top end",
  over: "is over your budget",
};

export function CostMeter({ low, high, budget }: CostMeterProps) {
  const scale = Math.max(high, budget) * 1.08;
  const pct = (value: number) => `${(value / scale) * 100}%`;
  const fit = budgetFit(low, high, budget);
  const label = `Estimated ${formatNaira(low)} to ${formatNaira(high)}, which ${SUMMARY[fit]} of ${formatNaira(budget)}.`;

  return (
    <figure role="img" aria-label={label} className="m-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="m-0 text-lg font-bold tabular-nums text-ink">
          {formatNairaShort(low)}–{formatNairaShort(high)}
        </p>
        <p className="m-0 text-sm text-muted">your budget {formatNairaShort(budget)}</p>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-line" aria-hidden="true">
        <span
          data-testid="cost-range"
          data-fit={fit}
          className={`absolute inset-y-0 rounded-full ${RANGE_CLASS[fit]}`}
          style={{ left: pct(low), width: `max(${pct(high - low)}, 6px)` }}
        />
        <span
          data-testid="budget-marker"
          className="absolute -top-1.5 h-5 w-0.5 rounded bg-ink"
          style={{ left: pct(budget) }}
        />
      </div>
    </figure>
  );
}
