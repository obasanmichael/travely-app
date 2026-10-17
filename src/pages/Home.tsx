import { useNavigate } from "react-router-dom";
import { SearchSentence } from "../features/search/SearchSentence";
import { DEFAULT_SEARCH, newSearchKey, toParams } from "../features/search/searchState";
import { useMeta } from "../features/search/useMeta";

const PROMISES = [
  {
    title: "The whole trip, priced",
    body: "Getting there, getting around, food and a place to stay, from published price data. You see a range, never a made-up number.",
  },
  {
    title: "The right time to go",
    body: "Every place gets a month-by-month ribbon built from decades of climate records, so you don't arrive in the rains.",
  },
  {
    title: "Reasons, not a list",
    body: "Each pick says why it made the cut: what matches your interests, how far it is and how it sits against your budget.",
  },
];

export function Home() {
  const navigate = useNavigate();
  const meta = useMeta();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-6 sm:px-6 sm:pt-12">
      <h1 className="sr-only">Find places that fit your budget</h1>

      {meta.status === "loading" && (
        <div aria-busy="true" className="animate-pulse">
          <div className="h-12 w-4/5 rounded bg-line/70" />
          <div className="mt-4 h-12 w-3/5 rounded bg-line/60" />
        </div>
      )}

      {meta.status === "error" && (
        <div role="alert" className="max-w-xl rounded-2xl border border-line bg-surface p-6">
          <p className="m-0 font-semibold text-ink">{meta.message}</p>
          <button type="button" onClick={meta.retry} className="mt-4 rounded-full bg-lagoon px-5 py-2.5 font-semibold text-white">
            Try again
          </button>
        </div>
      )}

      {meta.status === "ready" && (
        <SearchSentence
          meta={meta.meta}
          initial={DEFAULT_SEARCH}
          onSubmit={(search) => navigate(`/results?${toParams(search, newSearchKey())}`)}
        />
      )}

      <section aria-labelledby="how-title" className="mt-24 border-t border-line pt-10">
        <h2 id="how-title" className="m-0 text-xl font-bold text-ink">
          How Travely picks places
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          {PROMISES.map((promise) => (
            <div key={promise.title}>
              <h3 className="m-0 text-base font-bold text-ink">{promise.title}</h3>
              <p className="m-0 mt-2 max-w-[38ch] text-[15px] text-ink-soft">{promise.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
