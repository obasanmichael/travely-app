import { History, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, getRuns, type RunSummary } from "../../api/client";
import { describeTrip, type TripInputs } from "../../lib/trips";
import { ButtonLink } from "../../ui/Button";
import { EmptyState } from "../../ui/EmptyState";
import { PageIntro } from "../../ui/PageIntro";
import { Reveal } from "../../ui/Reveal";
import { Skeleton } from "../../ui/Skeleton";
import { useAuth } from "../auth/authContext";

export function TripsPage() {
  const { user } = useAuth();
  const [runs, setRuns] = useState<RunSummary[] | null>(user ? null : []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRuns([]);
      return;
    }
    let cancelled = false;
    getRuns()
      .then((found) => !cancelled && setRuns(found))
      .catch((failure: unknown) => !cancelled && setError(failure instanceof ApiError ? failure.message : "Couldn't load your trips."));
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div>
      <PageIntro
        title="Your trips"
        actions={
          <ButtonLink to="/app/plan">
            <Plus className="h-4 w-4" aria-hidden="true" /> New trip
          </ButtonLink>
        }
      >
        Every search you've made, so you can pick up where you left off.
      </PageIntro>

      {error && <p role="alert" className="rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">{error}</p>}
      {runs === null && !error && (
        <div aria-busy="true" className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      )}
      {runs?.length === 0 && (
        <EmptyState
          Icon={History}
          title="No trips yet"
          body="When you plan a trip it will show up here, ready to reopen or adjust."
          action={<ButtonLink to="/app/plan">Plan your first trip</ButtonLink>}
        />
      )}
      <ol className="m-0 flex list-none flex-col gap-4 p-0">
        {runs?.map((run, index) => (
          <li key={run.id}>
            <Reveal index={index}>
              <Link
                to={`/app/trips/${run.id}`}
                className="block rounded-2xl border border-line bg-surface p-5 no-underline shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <p className="m-0 font-semibold text-ink">{describeTrip(run.inputs as unknown as TripInputs)}</p>
                <p className="m-0 mt-1 text-sm text-muted">
                  {new Date(run.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </p>
                {run.top_places.length > 0 && <p className="m-0 mt-3 text-sm text-ink">Top picks: {run.top_places.join(", ")}</p>}
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
