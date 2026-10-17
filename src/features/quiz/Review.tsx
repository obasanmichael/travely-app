import { Pencil } from "lucide-react";
import type { Meta } from "../../api/client";
import { formatNaira, monthName } from "../../lib/format";
import { Card } from "../../ui/Card";
import type { SearchState } from "../search/searchState";

const TIER = { budget: "Keep it cheap", mid: "Comfortable", premium: "Treat myself" } as const;
const PACE = { relaxed: "Relaxed", balanced: "Balanced", packed: "Packed" } as const;

export function Review({ state, meta, onEdit, problems }: { state: SearchState; meta: Meta; onEdit: (step: number) => void; problems: string[] }) {
  const origin = meta.states.find((s) => s.iso === state.origin)?.name ?? state.origin;
  const interests = Object.entries(state.interests).map(([slug, level]) => {
    const label = meta.interests.find((i) => i.slug === slug)?.label ?? slug;
    return level === "like" ? `${label} (like)` : label;
  });
  const rows: { step: number; label: string; value: string }[] = [
    { step: 0, label: "From", value: origin },
    { step: 1, label: "When", value: state.month ? monthName(state.month) : "Flexible" },
    { step: 2, label: "Length", value: state.days === 1 ? "A day trip" : `${state.days} days` },
    { step: 3, label: "Who", value: `${state.travellers === 1 ? "Just me" : `${state.travellers} people`}${state.withChildren ? ", with children" : ""}` },
    { step: 4, label: "Budget", value: `${formatNaira(state.budget)} total` },
    { step: 5, label: "Comfort", value: TIER[state.tier] },
    { step: 6, label: "Into", value: interests.length ? interests.join(", ") : "Nothing in particular" },
    { step: 7, label: "Pace", value: `${PACE[state.pace]}${state.maxHours ? `, up to ${state.maxHours} hrs each way` : ""}` },
  ];
  return (
    <div>
      <h2 className="m-0 font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-tight text-ink">Ready when you are.</h2>
      <p className="mb-8 mt-3 text-muted">Check your answers. You can change any of them.</p>
      <Card className="divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="m-0 text-sm text-muted">{row.label}</p>
              <p className="m-0 truncate font-semibold text-ink">{row.value}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              aria-label={`Edit ${row.label.toLowerCase()}`}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-line hover:text-ink"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </Card>
      {problems.length > 0 && (
        <ul role="alert" className="mb-0 mt-5 list-none rounded-xl bg-danger-wash p-4 text-sm text-danger">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
