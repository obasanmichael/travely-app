import * as Slider from "@radix-ui/react-slider";
import { Gem, Leaf, Sofa, Zap, Coffee, Compass, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { getBudgetBand, type Meta } from "../../api/client";
import { formatNaira, monthName } from "../../lib/format";
import { Switch } from "../../ui/Switch";
import { cn } from "../../ui/cn";
import { LIMITS, type Level, type Pace, type SearchState, type Tier } from "../search/searchState";
import { Choice, Stepper } from "./Controls";
import { iconFor } from "./interestIcons";

export interface StepProps {
  state: SearchState;
  update: (patch: Partial<SearchState>) => void;
  meta: Meta;
}

export function OriginStep({ state, update, meta }: StepProps) {
  const [query, setQuery] = useState("");
  const shown = meta.states.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div>
      <label htmlFor="origin-search" className="sr-only">
        Search states
      </label>
      <input
        id="origin-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for your state"
        className="mb-5 h-12 w-full rounded-xl border border-line bg-surface px-4 text-base text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
      />
      <div className="grid max-h-[340px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3" role="group" aria-label="Starting state">
        {shown.map((s) => (
          <Choice key={s.iso} selected={state.origin === s.iso} onSelect={() => update({ origin: s.iso })} className="text-left">
            {s.name}
          </Choice>
        ))}
        {shown.length === 0 && <p className="col-span-full m-0 text-muted">No state matches "{query}".</p>}
      </div>
    </div>
  );
}

export function MonthStep({ state, update }: StepProps) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label="Month">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <Choice key={m} selected={state.month === m} onSelect={() => update({ month: m })}>
            {monthName(m)}
          </Choice>
        ))}
      </div>
      <Choice selected={state.month === null} onSelect={() => update({ month: null })} className="mt-3 w-full">
        I'm flexible. Show me the best months.
      </Choice>
    </div>
  );
}

function lengthLabel(days: number): string {
  if (days === 1) return "A day trip";
  if (days === 2 || days === 3) return "A short break";
  if (days === 7) return "A week";
  if (days >= 14) return "A long trip";
  return `${days} days`;
}

export function DaysStep({ state, update }: StepProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <Stepper value={state.days} min={LIMITS.days.min} max={LIMITS.days.max} onChange={(days) => update({ days })} label="days" />
      <p className="m-0 text-lg text-muted">{lengthLabel(state.days)}</p>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Common lengths">
        {[1, 2, 3, 5, 7, 14].map((d) => (
          <Choice key={d} selected={state.days === d} onSelect={() => update({ days: d })}>
            {d === 1 ? "Day trip" : `${d} days`}
          </Choice>
        ))}
      </div>
    </div>
  );
}

export function PeopleStep({ state, update }: StepProps) {
  return (
    <div className="flex flex-col items-center gap-10">
      <Stepper value={state.travellers} min={LIMITS.travellers.min} max={LIMITS.travellers.max} onChange={(travellers) => update({ travellers })} label="travellers" />
      <p className="m-0 text-lg text-muted">{state.travellers === 1 ? "Just you" : `${state.travellers} people`}</p>
      <label className="flex w-full max-w-sm items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
        <span>
          <span className="block font-semibold text-ink">Travelling with children</span>
          <span className="block text-sm text-muted">Favours family-friendly places.</span>
        </span>
        <Switch checked={state.withChildren} onCheckedChange={(withChildren) => update({ withChildren })} label="Travelling with children" />
      </label>
    </div>
  );
}

const BUDGET_MIN = 10_000;
const BUDGET_MAX = 3_000_000;

export function BudgetStep({ state, update }: StepProps) {
  const [text, setText] = useState(state.budget ? state.budget.toLocaleString("en-NG") : "");
  const [band, setBand] = useState<string | null>(null);
  const perPersonPerDay = state.budget > 0 ? Math.round(state.budget / (state.travellers * state.days)) : 0;

  useEffect(() => {
    if (perPersonPerDay <= 0) {
      setBand(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      getBudgetBand(perPersonPerDay)
        .then((result) => !cancelled && setBand(result.band))
        .catch(() => !cancelled && setBand(null));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [perPersonPerDay]);

  const setBudget = (value: number) => {
    update({ budget: value });
    setText(value ? value.toLocaleString("en-NG") : "");
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-baseline justify-center gap-1 border-b-2 border-primary pb-2 font-serif text-6xl text-ink">
        <span aria-hidden="true">₦</span>
        <input
          aria-label="Total budget in naira, for everyone"
          inputMode="numeric"
          autoComplete="off"
          value={text}
          size={Math.max(text.length, 4)}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
            setBudget(digits ? Number(digits) : 0);
          }}
          className="w-auto bg-transparent text-center focus:outline-none"
        />
      </div>
      <Slider.Root
        value={[Math.min(Math.max(state.budget, BUDGET_MIN), BUDGET_MAX)]}
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={5_000}
        onValueChange={([v]) => setBudget(v)}
        aria-label="Budget"
        className="relative flex h-6 w-full max-w-md touch-none select-none items-center"
      >
        <Slider.Track className="relative h-2 grow rounded-full bg-line">
          <Slider.Range className="absolute h-full rounded-full bg-primary" />
        </Slider.Track>
        <Slider.Thumb aria-label="Budget" className="block h-6 w-6 rounded-full border-2 border-primary bg-surface shadow-card focus:outline-none focus-visible:ring-4 focus-visible:ring-sun" />
      </Slider.Root>
      <p className="m-0 min-h-12 text-center text-muted" aria-live="polite">
        {perPersonPerDay > 0 && (
          <>
            That's about <strong className="text-ink">{formatNaira(perPersonPerDay)}</strong> per person per day
            {band ? (
              <>
                : a <strong className="text-primary">{band.toLowerCase()}</strong> budget.
              </>
            ) : (
              "."
            )}
          </>
        )}
      </p>
    </div>
  );
}

const TIERS: { value: Tier; title: string; body: string; Icon: typeof Leaf }[] = [
  { value: "budget", title: "Keep it cheap", body: "Simple stays and local food. Every naira counts.", Icon: Leaf },
  { value: "mid", title: "Comfortable", body: "A good room and proper meals without overspending.", Icon: Sofa },
  { value: "premium", title: "Treat myself", body: "Top stays and dining. This is the trip to splurge on.", Icon: Gem },
];

export function ComfortStep({ state, update }: StepProps) {
  return (
    <div className="grid gap-3" role="group" aria-label="Comfort level">
      {TIERS.map(({ value, title, body, Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={state.tier === value}
          onClick={() => update({ tier: value })}
          className={cn(
            "flex items-center gap-5 rounded-3xl border p-5 text-left transition-all duration-200",
            state.tier === value ? "border-primary bg-primary-wash shadow-card" : "border-line bg-surface hover:-translate-y-0.5 hover:border-primary/50"
          )}
        >
          <span className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-2xl", state.tier === value ? "bg-primary text-white" : "bg-line text-muted")}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold text-ink">{title}</span>
            <span className="block text-[15px] text-muted">{body}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

const NEXT_LEVEL: Record<string, Level | undefined> = { none: "love", love: "like", like: undefined };

export function InterestsStep({ state, update, meta }: StepProps) {
  const picked = Object.keys(state.interests).length;
  const cycle = (slug: string) => {
    const current = state.interests[slug];
    if (!current && picked >= LIMITS.interests) return;
    const next = NEXT_LEVEL[current ?? "none"];
    const interests = { ...state.interests };
    if (next) interests[slug] = next;
    else delete interests[slug];
    update({ interests });
  };
  return (
    <div>
      <p className="m-0 mb-5 text-sm text-muted">
        Tap once for <strong className="text-ink">love it</strong>, twice for <strong className="text-ink">like it</strong>, a third time to clear.{" "}
        {picked}/{LIMITS.interests} picked.
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" role="group" aria-label="Interests">
        {meta.interests.map((interest) => {
          const level = state.interests[interest.slug];
          const Icon = iconFor(interest.slug);
          const locked = !level && picked >= LIMITS.interests;
          return (
            <button
              key={interest.slug}
              type="button"
              disabled={locked}
              aria-label={`${interest.label}${level ? `, ${level === "love" ? "love it" : "like it"}` : ""}`}
              onClick={() => cycle(interest.slug)}
              className={cn(
                "relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 disabled:opacity-40",
                level === "love" && "border-primary bg-primary text-white shadow-card",
                level === "like" && "border-primary bg-primary-wash text-primary",
                !level && "border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-primary/50"
              )}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span className="text-[15px] font-semibold leading-tight">{interest.label}</span>
              {level && (
                <Heart className={cn("absolute right-3 top-3 h-4 w-4", level === "love" ? "fill-current" : "")} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const PACES: { value: Pace; title: string; body: string; Icon: typeof Coffee }[] = [
  { value: "relaxed", title: "Relaxed", body: "Slow mornings and few plans.", Icon: Coffee },
  { value: "balanced", title: "Balanced", body: "A bit of everything.", Icon: Compass },
  { value: "packed", title: "Packed", body: "See and do as much as possible.", Icon: Zap },
];

const NO_LIMIT = 13;

export function PaceStep({ state, update }: StepProps) {
  const hours = state.maxHours ?? NO_LIMIT;
  return (
    <div className="flex flex-col gap-9">
      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Pace">
        {PACES.map(({ value, title, body, Icon }) => (
          <button
            key={value}
            type="button"
            aria-pressed={state.pace === value}
            onClick={() => update({ pace: value })}
            className={cn(
              "flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-200",
              state.pace === value ? "border-primary bg-primary-wash" : "border-line bg-surface hover:border-primary/50"
            )}
          >
            <Icon className={cn("h-6 w-6", state.pace === value ? "text-primary" : "text-muted")} aria-hidden="true" />
            <span className="font-bold text-ink">{title}</span>
            <span className="text-sm text-muted">{body}</span>
          </button>
        ))}
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label className="font-semibold text-ink">Longest trip each way</label>
          <span className="font-semibold text-primary" aria-live="polite">
            {hours >= NO_LIMIT ? "No limit" : `${hours} hours`}
          </span>
        </div>
        <Slider.Root
          value={[hours]}
          min={1}
          max={NO_LIMIT}
          step={1}
          onValueChange={([v]) => update({ maxHours: v >= NO_LIMIT ? null : v })}
          aria-label="Longest trip each way"
          className="relative mt-4 flex h-6 w-full touch-none select-none items-center"
        >
          <Slider.Track className="relative h-2 grow rounded-full bg-line">
            <Slider.Range className="absolute h-full rounded-full bg-primary" />
          </Slider.Track>
          <Slider.Thumb aria-label="Longest trip each way" className="block h-6 w-6 rounded-full border-2 border-primary bg-surface shadow-card focus:outline-none focus-visible:ring-4 focus-visible:ring-sun" />
        </Slider.Root>
      </div>
    </div>
  );
}
