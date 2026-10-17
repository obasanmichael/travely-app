import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../ui/cn";

export function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex items-center justify-center gap-6" role="group" aria-label={label}>
      <button
        type="button"
        aria-label={`Fewer ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="grid h-14 w-14 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-primary disabled:opacity-40"
      >
        <Minus className="h-5 w-5" aria-hidden="true" />
      </button>
      <output aria-live="polite" className="w-24 text-center font-serif text-7xl tabular-nums text-ink">
        {value}
      </output>
      <button
        type="button"
        aria-label={`More ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="grid h-14 w-14 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-primary disabled:opacity-40"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Choice({ selected, onSelect, children, className }: { selected: boolean; onSelect: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "rounded-2xl border px-4 py-3 text-[15px] font-semibold transition-all duration-200",
        selected
          ? "border-primary bg-primary-wash text-primary shadow-card"
          : "border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-primary/50",
        className
      )}
    >
      {children}
    </button>
  );
}
