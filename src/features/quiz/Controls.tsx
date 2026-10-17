import { Minus, Plus } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../../ui/cn";

export function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
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
      <input
        aria-label={`Number of ${label}`}
        inputMode="numeric"
        autoComplete="off"
        value={text}
        size={Math.max(text.length, 1)}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, String(max).length);
          setText(digits);
          // Out-of-range or empty text waits for blur, so typing "1" on the way to "14" isn't rejected.
          const typed = Number(digits);
          if (digits && typed >= min && typed <= max) onChange(typed);
        }}
        onBlur={() => {
          const typed = Number(text);
          const settled = Math.min(Math.max(text ? typed : value, min), max);
          setText(String(settled));
          onChange(settled);
        }}
        className="min-w-24 max-w-[7ch] bg-transparent text-center font-serif text-7xl tabular-nums text-ink focus:outline-none focus-visible:underline"
      />
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
