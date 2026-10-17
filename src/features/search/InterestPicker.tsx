import type { Interest } from "../../api/client";
import { LIMITS, type Level } from "./searchState";

interface InterestPickerProps {
  interests: Interest[];
  value: Record<string, Level>;
  onChange: (value: Record<string, Level>) => void;
  tone?: "light" | "dark";
}

export function InterestPicker({ interests, value, onChange, tone = "light" }: InterestPickerProps) {
  const dark = tone === "dark";
  const selected = Object.keys(value);
  const full = selected.length >= LIMITS.interests;

  const toggle = (slug: string) => {
    const next = { ...value };
    if (next[slug]) delete next[slug];
    else if (!full) next[slug] = "love";
    onChange(next);
  };

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className={`mb-3 text-base font-semibold ${dark ? "text-white" : "text-ink"}`}>
        What do you enjoy?{" "}
        <span className={`font-normal ${dark ? "text-white/70" : "text-ink-soft"}`}>Pick up to {LIMITS.interests}.</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => {
          const level = value[interest.slug];
          return (
            <button
              key={interest.slug}
              type="button"
              aria-pressed={Boolean(level)}
              disabled={!level && full}
              title={interest.description}
              onClick={() => toggle(interest.slug)}
              className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${
                level
                  ? dark
                    ? "border-sun bg-sun text-ink"
                    : "border-lagoon bg-lagoon text-white"
                  : dark
                    ? "border-white/25 bg-white/5 text-white hover:border-sun"
                    : "border-line bg-surface text-ink hover:border-lagoon"
              }`}
            >
              {interest.label}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <ul className="mt-4 flex list-none flex-col gap-2 p-0" aria-label="How much you enjoy each">
          {selected.map((slug) => {
            const label = interests.find((i) => i.slug === slug)?.label ?? slug;
            return (
              <li key={slug} className="flex items-center justify-between gap-3">
                <span className={`text-sm ${dark ? "text-white" : "text-ink"}`}>{label}</span>
                <span
                  className={`inline-flex rounded-full border p-0.5 ${dark ? "border-white/25 bg-white/5" : "border-line bg-surface"}`}
                  role="group"
                  aria-label={label}
                >
                  {(["love", "like"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={value[slug] === level}
                      onClick={() => onChange({ ...value, [slug]: level })}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        value[slug] === level
                          ? dark
                            ? "bg-sun text-ink"
                            : "bg-ink text-white"
                          : dark
                            ? "text-white/70"
                            : "text-ink-soft"
                      }`}
                    >
                      {level === "love" ? "Love it" : "Like it"}
                    </button>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}
