import { monthInitial, monthName } from "../lib/format";
import { seasonLevel, type SeasonLevel } from "../lib/season";


const CELL_CLASS: Record<SeasonLevel, string> = {
  great: "bg-sun",
  fair: "bg-sun/35",
  wet: "bg-rain/60",
};

function describe(scores: number[], month?: number | null): string {
  const great = scores
    .map((score, i) => (seasonLevel(score) === "great" ? monthName(i + 1) : null))
    .filter(Boolean);
  const best = great.length ? `Best months: ${great.join(", ")}.` : "No standout months.";
  if (!month) return best;
  const level = seasonLevel(scores[month - 1]);
  const verdict = { great: "a great time to go", fair: "an okay time to go", wet: "a wet month" }[level];
  return `${best} ${monthName(month)} is ${verdict}.`;
}

interface SeasonRibbonProps {
  scores: number[];
  month?: number | null;
}

export function SeasonRibbon({ scores, month }: SeasonRibbonProps) {
  if (scores.length !== 12) {
    return <p className="text-sm text-ink-soft">Season data isn't available for this place yet.</p>;
  }
  return (
    <figure role="img" aria-label={describe(scores, month)} className="m-0">
      <div className="grid grid-cols-12 gap-1" aria-hidden="true">
        {scores.map((score, index) => {
          const isTravelMonth = month === index + 1;
          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <span
                className={`h-3 w-full rounded-sm ${CELL_CLASS[seasonLevel(score)]} ${
                  isTravelMonth ? "outline-2 outline-offset-1 outline-ink" : ""
                }`}
              />
              <span className={`text-[11px] leading-none ${isTravelMonth ? "font-bold text-ink" : "text-ink-soft"}`}>
                {monthInitial(index + 1)}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
