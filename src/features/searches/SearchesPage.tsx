import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, getRuns, type RunSummary } from "../../api/client";
import { formatNaira, monthName } from "../../lib/format";

type Inputs = {
  budget: number;
  days: number;
  travellers: number;
  month?: number | null;
  origin_state: string;
};

function describe(inputs: Inputs): string {
  const days = inputs.days === 1 ? "a day trip" : `${inputs.days} days`;
  const who = inputs.travellers === 1 ? "1 person" : `${inputs.travellers} people`;
  return `${formatNaira(inputs.budget)}, ${days}, ${who}${inputs.month ? `, ${monthName(inputs.month)}` : ""}`;
}

export function SearchesPage() {
  const [runs, setRuns] = useState<RunSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRuns()
      .then(setRuns)
      .catch((failure: unknown) => setError(failure instanceof ApiError ? failure.message : "Couldn't load your searches."));
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      <h1 className="m-0 text-3xl font-bold tracking-tight text-ink">Your searches</h1>
      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-alert-wash px-5 py-3 text-sm text-alert">
          {error}
        </p>
      )}
      {runs === null && !error && <p className="mt-8 text-ink-soft">Loading…</p>}
      {runs?.length === 0 && <p className="mt-8 text-ink-soft">No searches yet.</p>}
      <ol className="mt-8 flex list-none flex-col gap-4 p-0">
        {runs?.map((run) => {
          const inputs = run.inputs as unknown as Inputs;
          return (
            <li key={run.id} className="rounded-2xl bg-surface p-5 ring-1 ring-line">
              <p className="m-0 font-semibold text-ink">{describe(inputs)}</p>
              <p className="m-0 mt-1 text-sm text-ink-soft">
                {new Date(run.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
              </p>
              {run.top_places.length > 0 && (
                <p className="m-0 mt-2 text-sm text-ink">Top picks: {run.top_places.join(", ")}</p>
              )}
            </li>
          );
        })}
      </ol>
      <Link to="/" className="mt-8 inline-block font-semibold text-lagoon underline">
        Start a new search
      </Link>
    </main>
  );
}
