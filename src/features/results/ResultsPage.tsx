import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Meta } from "../../api/client";
import { formatNaira, monthName } from "../../lib/format";
import { SearchSentence } from "../search/SearchSentence";
import { fromParams, newSearchKey, toParams, type SearchState } from "../search/searchState";
import { useMeta } from "../search/useMeta";
import { ResultCard } from "./ResultCard";
import { nothingFitsReason } from "./messages";
import { useRecommendations } from "./useRecommendations";

const RELAXED_TEXT: Record<string, string> = {
  budget: "Nothing fit your budget exactly, so some picks may cost up to 35% more.",
  travel_time: "Nothing was close enough, so some picks are further than your travel limit.",
};

const TIER_LABELS = { budget: "Keep it cheap", mid: "Comfortable", premium: "Treat myself" } as const;

function TripPanel({ search, meta, onEdit }: { search: SearchState; meta: Meta | null; onEdit: () => void }) {
  const origin = meta?.states.find((s) => s.iso === search.origin)?.name ?? "…";
  const interestLabels = Object.entries(search.interests).map(
    ([slug, level]) => `${meta?.interests.find((i) => i.slug === slug)?.label ?? slug}${level === "like" ? " (like)" : ""}`
  );
  const rows: [string, string][] = [
    ["Budget", `${formatNaira(search.budget)} total`],
    ["Trip", search.days === 1 ? "A day trip" : `${search.days} days`],
    ["From", origin],
    ["Who", search.travellers === 1 ? "Just me" : `${search.travellers} people${search.withChildren ? ", with children" : ""}`],
    ["When", search.month ? monthName(search.month) : "Flexible"],
    ["Comfort", TIER_LABELS[search.tier]],
  ];
  return (
    <section aria-labelledby="trip-title" className="rounded-3xl bg-ink p-6 text-white lg:sticky lg:top-6">
      <h2 id="trip-title" className="m-0 text-lg font-bold">
        Your trip
      </h2>
      <dl className="m-0 mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-white/60">{label}</dt>
            <dd className="m-0 font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      {interestLabels.length > 0 && (
        <p className="mb-0 mt-4 text-sm">
          <span className="text-white/60">Into </span>
          <span className="font-semibold">{interestLabels.join(", ")}</span>
        </p>
      )}
      <button
        type="button"
        onClick={onEdit}
        className="mt-6 w-full rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-ink hover:brightness-95"
      >
        Change trip
      </button>
    </section>
  );
}

function Skeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
      <div className="aspect-[16/9] bg-line/60" />
      <div className="flex flex-col gap-3 p-7">
        <div className="h-6 w-2/3 rounded bg-line/70" />
        <div className="h-4 w-1/3 rounded bg-line/60" />
        <div className="h-3 w-full rounded bg-line/50" />
      </div>
    </div>
  );
}

export function ResultsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { state: search, key } = fromParams(params);
  const meta = useMeta();
  const { state, retry } = useRecommendations(search, key);
  const [editing, setEditing] = useState(false);

  // A results URL without a key (e.g. typed by hand) gets one, so reloads replay the same run.
  useEffect(() => {
    if (!key) setParams(toParams(search, newSearchKey()), { replace: true });
  }, [key, search, setParams]);

  const startSearch = (next: SearchState) => {
    setEditing(false);
    navigate(`/app/results?${toParams(next, newSearchKey())}`);
    window.scrollTo({ top: 0 });
  };

  const metaValue = meta.status === "ready" ? meta.meta : null;
  const data = state.status === "ready" ? state.data : null;
  const priced = data?.recommendations ?? [];
  const unverified = data?.unverified_stays ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      {editing && metaValue && (
        <section aria-label="Change your trip" className="mb-10 rounded-3xl bg-ink p-6 sm:p-10">
          <SearchSentence tone="dark" meta={metaValue} initial={search} submitLabel="Update places" onSubmit={startSearch} />
          <button type="button" onClick={() => setEditing(false)} className="mt-4 text-sm font-semibold text-white/80 underline">
            Cancel
          </button>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <TripPanel search={search} meta={metaValue} onEdit={() => setEditing(true)} />

        <div aria-live="polite" className="flex flex-col gap-6">
          {state.status === "loading" && (
            <>
              <p className="m-0 text-ink-soft">Finding places that fit…</p>
              <Skeleton />
              <Skeleton />
            </>
          )}

          {state.status === "error" && (
            <div role="alert" className="rounded-3xl bg-surface p-7 ring-1 ring-line">
              <p className="m-0 font-semibold text-ink">{state.error.message}</p>
              <div className="mt-4 flex gap-3">
                {state.error.retryable && (
                  <button type="button" onClick={retry} className="rounded-full bg-lagoon px-5 py-2.5 font-semibold text-white">
                    Try again
                  </button>
                )}
                {state.error.status === 409 && (
                  <button type="button" onClick={() => startSearch(search)} className="rounded-full bg-lagoon px-5 py-2.5 font-semibold text-white">
                    Start a new search
                  </button>
                )}
              </div>
            </div>
          )}

          {data && priced.length === 0 && unverified.length === 0 && (
            <div className="rounded-3xl bg-surface p-7 ring-1 ring-line">
              <h2 className="m-0 text-xl font-bold text-ink">Nothing fits this trip yet</h2>
              <p className="mb-0 mt-2 max-w-prose text-ink-soft">{nothingFitsReason(data, search)}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {search.days > 1 && (
                  <button
                    type="button"
                    onClick={() => startSearch({ ...search, days: 1 })}
                    className="rounded-full bg-lagoon px-5 py-2.5 font-semibold text-white"
                  >
                    See day trips instead
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-full border border-line bg-surface px-5 py-2.5 font-semibold text-ink"
                >
                  Change trip
                </button>
              </div>
            </div>
          )}

          {data?.relaxed.map((r) => (
            <p key={r} className="m-0 rounded-2xl bg-sun/25 px-5 py-3 text-sm text-ink">
              {RELAXED_TEXT[r] ?? r}
            </p>
          ))}
          {data?.notes
            .filter(() => priced.length > 0)
            .map((note) => (
              <p key={note} className="m-0 text-sm text-ink-soft">
                {note}
              </p>
            ))}

          {priced.length > 0 && (
            <section aria-labelledby="priced-title" className="flex flex-col gap-6">
              <h1 id="priced-title" className="m-0 text-3xl font-bold tracking-tight text-ink">
                {priced.length === 1 ? "1 place fits" : `${priced.length} places fit`}
              </h1>
              <ol className="m-0 flex list-none flex-col gap-8 p-0">
                {priced.map((item, index) => (
                  <li key={item.destination.id}>
                    <ResultCard item={item} budget={search.budget} month={search.month} rank={index} />
                  </li>
                ))}
              </ol>
            </section>
          )}

          {unverified.length > 0 && (
            <section aria-labelledby="unverified-title" className="flex flex-col gap-6">
              <div>
                <h2 id="unverified-title" className="m-0 text-2xl font-bold tracking-tight text-ink">
                  {priced.length ? "Also worth a look" : "Places that could work"}
                </h2>
                <p className="mb-0 mt-2 max-w-prose text-ink-soft">
                  These fit your trip on travel and food. We haven't verified what places to stay cost there yet, so budget
                  for that on top.
                </p>
              </div>
              <ol className="m-0 flex list-none flex-col gap-8 p-0">
                {unverified.map((item, index) => (
                  <li key={item.destination.id}>
                    <ResultCard item={item} budget={search.budget} month={search.month} rank={priced.length + index} />
                  </li>
                ))}
              </ol>
            </section>
          )}

          {data && data.exclusions.cost_unknown > 0 && (priced.length > 0 || unverified.length > 0) && (
            <p className="m-0 text-sm text-ink-soft">
              Some places aren't shown because we haven't verified enough of their prices for a trip like this.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
