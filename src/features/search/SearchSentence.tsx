import { useId, useState, type FormEvent, type ReactNode } from "react";
import type { Meta } from "../../api/client";
import { InlineSelect } from "../../components/InlineSelect";
import { monthName } from "../../lib/format";
import { InterestPicker } from "./InterestPicker";
import { LIMITS, validate, type Pace, type SearchState, type Tier } from "./searchState";

interface SearchSentenceProps {
  meta: Meta;
  initial: SearchState;
  submitLabel?: string;
  onSubmit: (state: SearchState) => void;
}

const inlineControl =
  "mx-1 inline-block rounded-none border-0 border-b-2 border-lagoon bg-transparent px-1 font-bold text-lagoon " +
  "focus:border-ink focus:outline-none";

const TIER_LABELS: Record<Tier, string> = {
  budget: "Keep it cheap",
  mid: "Comfortable",
  premium: "Treat myself",
};
const PACE_LABELS: Record<Pace, string> = { relaxed: "Relaxed", balanced: "Balanced", packed: "Packed" };

function Choice<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: Record<T, string>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-2 text-sm font-semibold text-ink">{legend}</legend>
      <div className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
        {(Object.keys(options) as T[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
              value === option ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {options[option]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
      {label}
      {children}
    </label>
  );
}

const boxControl = "rounded-lg border border-line bg-surface px-3 py-2.5 text-base font-normal text-ink";

export function SearchSentence({ meta, initial, submitLabel = "Show me places", onSubmit }: SearchSentenceProps) {
  const [state, setState] = useState<SearchState>(initial);
  const [budgetText, setBudgetText] = useState(initial.budget.toLocaleString("en-NG"));
  const [problems, setProblems] = useState<string[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const errorId = useId();

  const update = (patch: Partial<SearchState>) => setState((current) => ({ ...current, ...patch }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate(state);
    setProblems(found);
    if (found.length === 0) onSubmit(state);
  };

  return (
    <form onSubmit={submit} noValidate aria-describedby={problems.length ? errorId : undefined}>
      <p className="m-0 max-w-[22ch] text-[clamp(1.75rem,5.5vw,3.25rem)] font-semibold leading-[1.35] tracking-tight text-ink">
        I have ₦
        <input
          aria-label="Total budget in naira, for everyone"
          inputMode="numeric"
          autoComplete="off"
          value={budgetText}
          size={Math.max(budgetText.length, 5)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
            setBudgetText(digits ? Number(digits).toLocaleString("en-NG") : "");
            update({ budget: digits ? Number(digits) : 0 });
          }}
          className={`${inlineControl} ml-0 w-auto`}
        />
        for
        <InlineSelect
          label="Trip length"
          value={state.days}
          options={Array.from({ length: LIMITS.days.max }, (_, i) => ({
            value: i + 1,
            label: i === 0 ? "a day trip" : `${i + 1} days`,
          }))}
          onChange={(days) => update({ days })}
        />
        from
        <InlineSelect
          label="Where you're starting from"
          value={state.origin}
          options={meta.states.map((st) => ({ value: st.iso, label: st.name }))}
          onChange={(origin) => update({ origin })}
        />
        for
        <InlineSelect
          label="Number of travellers"
          value={state.travellers}
          options={Array.from({ length: LIMITS.travellers.max }, (_, i) => ({
            value: i + 1,
            label: i === 0 ? "just me" : `${i + 1} people`,
          }))}
          onChange={(travellers) => update({ travellers })}
        />
        .
      </p>

      <div className="mt-10 max-w-2xl">
        <InterestPicker
          interests={meta.interests}
          value={state.interests}
          onChange={(interests) => update({ interests })}
        />
      </div>

      <div className="mt-8 max-w-2xl">
        <button
          type="button"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((open) => !open)}
          className="text-sm font-semibold text-lagoon underline underline-offset-4"
        >
          {moreOpen ? "Fewer options" : "More options: when, comfort, pace"}
        </button>

        {moreOpen && (
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <Field label="When are you going?">
              <select
                value={state.month ?? ""}
                onChange={(event) => update({ month: event.target.value ? Number(event.target.value) : null })}
                className={boxControl}
              >
                <option value="">I'm flexible</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {monthName(m)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Longest you'll travel each way">
              <select
                value={state.maxHours ?? ""}
                onChange={(event) => update({ maxHours: event.target.value ? Number(event.target.value) : null })}
                className={boxControl}
              >
                <option value="">No limit</option>
                {[2, 4, 6, 8, 12].map((h) => (
                  <option key={h} value={h}>
                    {h} hours
                  </option>
                ))}
              </select>
            </Field>
            <Choice legend="Comfort" options={TIER_LABELS} value={state.tier} onChange={(tier) => update({ tier })} />
            <Choice legend="Pace" options={PACE_LABELS} value={state.pace} onChange={(pace) => update({ pace })} />
            <label className="flex items-center gap-3 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={state.withChildren}
                onChange={(event) => update({ withChildren: event.target.checked })}
                className="h-5 w-5 accent-lagoon"
              />
              Travelling with children
            </label>
          </div>
        )}
      </div>

      {problems.length > 0 && (
        <ul id={errorId} role="alert" className="mt-6 max-w-2xl list-none rounded-lg bg-alert-wash p-4 text-sm text-alert">
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        className="mt-8 rounded-full bg-lagoon px-7 py-3.5 text-base font-semibold text-white hover:bg-lagoon-deep"
      >
        {submitLabel}
      </button>
    </form>
  );
}
