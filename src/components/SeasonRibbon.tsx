import { useState } from "react";
import { monthInitial, monthName } from "../lib/format";
import { seasonLevel, type SeasonLevel } from "../lib/season";

const CELL_CLASS: Record<SeasonLevel, string> = {
  great: "bg-sun",
  fair: "bg-sun/35",
  wet: "bg-rain/60",
};

const LEVEL_TEXT: Record<SeasonLevel, string> = {
  great: "a great time to go",
  fair: "an okay time to go",
  wet: "a wet month",
};

function describe(scores: number[], month?: number | null): string {
  const great = scores
    .map((score, i) => (seasonLevel(score) === "great" ? monthName(i + 1) : null))
    .filter(Boolean);
  const best = great.length ? `Best months: ${great.join(", ")}.` : "No standout months.";
  if (!month) return best;
  return `${best} ${monthName(month)} is ${LEVEL_TEXT[seasonLevel(scores[month - 1])]}.`;
}

interface SeasonRibbonProps {
  scores: number[];
  month?: number | null;
  /** Fill month by month on first show. */
  animate?: boolean;
  /** Show the hovered month's verdict under the ribbon. */
  interactive?: boolean;
  size?: "sm" | "lg";
}

export function SeasonRibbon({ scores, month, animate = false, interactive = false, size = "sm" }: SeasonRibbonProps) {
  const [hover, setHover] = useState<number | null>(null);
  if (scores.length !== 12) {
    return <p className="m-0 text-sm text-muted">Season data isn't available for this place yet.</p>;
  }
  const focus = hover ?? (month ? month - 1 : null);
  return (
    <figure role="img" aria-label={describe(scores, month)} className="m-0">
      <div className="grid grid-cols-12 gap-1" aria-hidden="true">
        {scores.map((score, index) => {
          const isTravelMonth = month === index + 1;
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-1"
              onMouseEnter={interactive ? () => setHover(index) : undefined}
              onMouseLeave={interactive ? () => setHover(null) : undefined}
            >
              <span
                className={`${size === "lg" ? "h-8" : "h-3"} w-full origin-left rounded-md transition-transform ${CELL_CLASS[seasonLevel(score)]} ${
                  isTravelMonth ? "outline-2 outline-offset-1 outline-ink" : ""
                } ${interactive && hover === index ? "scale-y-125" : ""} ${animate ? "animate-ribbon-fill" : ""}`}
                style={animate ? { animationDelay: `${index * 45}ms` } : undefined}
              />
              <span className={`text-[11px] leading-none ${focus === index ? "font-bold text-ink" : "text-muted"}`}>
                {monthInitial(index + 1)}
              </span>
            </div>
          );
        })}
      </div>
      {interactive && (
        <p className="m-0 mt-3 min-h-5 text-sm text-muted" aria-hidden="true">
          {focus !== null ? `${monthName(focus + 1)}: ${LEVEL_TEXT[seasonLevel(scores[focus])]}` : "Hover a month"}
        </p>
      )}
    </figure>
  );
}
