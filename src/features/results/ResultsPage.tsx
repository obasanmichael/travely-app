import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatNaira, monthName } from "../../lib/format";
import { SearchSentence } from "../search/SearchSentence";
import { fromParams, newSearchKey, toParams, type SearchState } from "../search/searchState";
import { useMeta } from "../search/useMeta";
import { ResultCard } from "./ResultCard";
import { useRecommendations } from "./useRecommendations";

const RELAXED_TEXT: Record<string, string> = {
  budget: "Nothing fit your budget exactly, so some picks may cost up to 35% more.",
  travel_time: "Nothing was close enough, so some picks are further than your travel limit.",
};

function summary(search: SearchState, originName: string): string {
  const days = search.days === 1 ? "a day trip" : `${search.days} days`;
  const who = search.travellers === 1 ? "just me" : `${search.travellers} people`;
  const when = search.month ? ` in ${monthName(search.month)}` : "";
  return `${formatNaira(search.budget)} for ${days} from ${originName}, ${who}${when}`;
}

function Skeleton() {
  return (
    <div aria-hidden="true" className="grid animate-pulse overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-[2fr_3fr]">
      <div className="aspect-[4/3] bg-line/60" />
      <div className="flex flex-col gap-3 p-6">
        <div className="h-6 w-2/3 rounded bg-line/70" />
        <div className="h-4 w-1/3 rounded bg-line/60" />
        <div className="h-4 w-full rounded bg-line/50" />
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
    navigate(`/results?${toParams(next, newSearchKey())}`);
  };

  const originName =
    meta.status === "ready" ? meta.meta.states.find((s) => s.iso === search.origin)?.name ?? search.origin : "…";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <section aria-label="Your search" className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
        <p className="m-0 text-lg font-semibold text-ink">{summary(search, originName)}</p>
        {meta.status === "ready" && (
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            aria-expanded={editing}
            className="text-sm font-semibold text-lagoon underline underline-offset-4"
          >
            {editing ? "Close" : "Change search"}
          </button>
        )}
      </section>

      {editing && meta.status === "ready" && (
        <section aria-label="Change your search" className="border-b border-line py-8">
          <SearchSentence meta={meta.meta} initial={search} submitLabel="Update places" onSubmit={startSearch} />
        </section>
      )}

      <div aria-live="polite" className="mt-8">
        {state.status === "loading" && (
          <div className="flex flex-col gap-6">
            <p className="m-0 text-ink-soft">Finding places that fit…</p>
            <Skeleton />
            <Skeleton />
          </div>
        )}

        {state.status === "error" && (
          <div role="alert" className="rounded-2xl border border-line bg-surface p-6">
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

        {state.status === "ready" && state.data.recommendations.length === 0 && (
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="m-0 text-xl font-bold text-ink">Nothing fits this search yet</h2>
            <p className="mb-0 mt-2 text-ink-soft">
              {state.data.cheapest_feasible_budget
                ? `The cheapest trip like this starts around ${formatNaira(state.data.cheapest_feasible_budget)}. Try a bigger budget, a shorter trip or fewer travellers.`
                : "We haven't priced places for this kind of trip yet. Try a day trip, or check back soon."}
            </p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-5 rounded-full bg-lagoon px-5 py-2.5 font-semibold text-white"
            >
              Change search
            </button>
          </div>
        )}

        {state.status === "ready" && state.data.recommendations.length > 0 && (
          <>
            {state.data.relaxed.map((r) => (
              <p key={r} className="m-0 mb-4 rounded-lg bg-sun/20 px-4 py-3 text-sm text-ink">
                {RELAXED_TEXT[r] ?? r}
              </p>
            ))}
            {state.data.notes.map((note) => (
              <p key={note} className="m-0 mb-4 text-sm text-ink-soft">
                {note}
              </p>
            ))}
            <h1 className="sr-only">Places that fit</h1>
            <ol className="m-0 flex list-none flex-col gap-6 p-0">
              {state.data.recommendations.map((item, index) => (
                <li key={item.destination.id}>
                  <ResultCard item={item} budget={search.budget} month={search.month} rank={index} />
                </li>
              ))}
            </ol>
            {state.data.exclusions.cost_unknown > 0 && (
              <p className="mt-8 text-sm text-ink-soft">
                {state.data.exclusions.cost_unknown} more places aren't shown because we haven't verified their
                prices for a trip like this yet.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
