import * as Tabs from "@radix-ui/react-tabs";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatNaira, monthName } from "../../lib/format";
import { Button, ButtonLink } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Skeleton } from "../../ui/Skeleton";
import { nothingFitsReason } from "../results/messages";
import { fromRequest } from "../search/searchState";
import { TripCard } from "./TripCard";
import { TripDrawer } from "./TripDrawer";
import { useTrip } from "./useTrip";
import type { RecommendationItem } from "../../api/client";

const RELAXED_TEXT: Record<string, string> = {
  budget: "Nothing fit your budget exactly, so some picks may cost up to 35% more.",
  travel_time: "Nothing was close enough, so some picks are further than your travel limit.",
};

const REVIEW_STEP = 8;

function Grid({ items, budget, month, onOpen, offset = 0 }: { items: RecommendationItem[]; budget: number; month: number | null; onOpen: (i: RecommendationItem) => void; offset?: number }) {
  return (
    <ol className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <li key={item.destination.id}>
          <TripCard item={item} budget={budget} month={month} rank={index + offset} index={index} onOpen={() => onOpen(item)} />
        </li>
      ))}
    </ol>
  );
}

export function TripPage() {
  const { runId = "" } = useParams();
  const navigate = useNavigate();
  const state = useTrip(runId);
  const [open, setOpen] = useState<RecommendationItem | null>(null);

  if (state.status === "loading") {
    return (
      <div aria-busy="true" className="flex flex-col gap-6">
        <Skeleton className="h-12 w-2/3" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <Card role="alert" className="max-w-xl p-8">
        <h2 className="m-0 text-xl font-bold text-ink">{state.error.status === 404 ? "We couldn't find that trip" : state.error.message}</h2>
        <p className="mb-0 mt-2 text-muted">
          {state.error.status === 404 ? "It may belong to another account, or it was started on a different device as a guest." : "Check your connection and try again."}
        </p>
        <div className="mt-5 flex gap-3">
          {state.error.retryable && <Button onClick={state.retry}>Try again</Button>}
          <ButtonLink to="/app/plan" variant="secondary">
            Plan a new trip
          </ButtonLink>
        </div>
      </Card>
    );
  }

  const { trip } = state;
  const search = fromRequest(trip.inputs);
  const data = trip.outputs;
  const priced = data.recommendations;
  const unverified = data.unverified_stays ?? [];
  const nothing = priced.length === 0 && unverified.length === 0;
  const edit = (step = 0, patch: Partial<typeof search> = {}) => navigate("/app/plan", { state: { prefill: { ...search, ...patch }, step } });

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="m-0 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-tight text-ink">
            {formatNaira(search.budget)} for {search.days === 1 ? "a day trip" : `${search.days} days`}
          </h2>
          <p className="m-0 mt-2 text-muted">
            {search.travellers === 1 ? "Just you" : `${search.travellers} people`}
            {search.month ? `, ${monthName(search.month)}` : ", flexible dates"}
            {data.budget_band ? `, a ${data.budget_band.toLowerCase()} budget` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => edit(0)}>
            <Pencil className="h-4 w-4" aria-hidden="true" /> Edit trip
          </Button>
          <ButtonLink to="/app/plan" onClick={() => sessionStorage.removeItem("travely-quiz-draft")}>
            <Plus className="h-4 w-4" aria-hidden="true" /> New trip
          </ButtonLink>
        </div>
      </header>

      {data.relaxed.map((r) => (
        <p key={r} className="m-0 rounded-2xl bg-sun/25 px-5 py-3 text-sm text-ink">
          {RELAXED_TEXT[r] ?? r}
        </p>
      ))}

      {nothing && (
        <Card className="max-w-2xl p-8">
          <h2 className="m-0 text-xl font-bold text-ink">Nothing fits this trip yet</h2>
          <p className="mb-0 mt-2 text-muted">{nothingFitsReason(data, search)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {search.days > 1 && <Button onClick={() => edit(REVIEW_STEP, { days: 1 })}>See day trips instead</Button>}
            <Button variant="secondary" onClick={() => edit(4)}>
              Change budget
            </Button>
          </div>
        </Card>
      )}

      {!nothing && (
        <Tabs.Root defaultValue={priced.length > 0 ? "priced" : "unverified"}>
          <Tabs.List aria-label="Results" className="mb-6 inline-flex gap-1 rounded-full border border-line bg-surface p-1">
            {priced.length > 0 && (
              <Tabs.Trigger value="priced" className="rounded-full px-5 py-2 text-sm font-semibold text-muted transition-colors data-[state=active]:bg-primary data-[state=active]:text-white">
                Best matches ({priced.length})
              </Tabs.Trigger>
            )}
            {unverified.length > 0 && (
              <Tabs.Trigger value="unverified" className="rounded-full px-5 py-2 text-sm font-semibold text-muted transition-colors data-[state=active]:bg-primary data-[state=active]:text-white">
                Could work ({unverified.length})
              </Tabs.Trigger>
            )}
          </Tabs.List>
          {priced.length > 0 && (
            <Tabs.Content value="priced" className="outline-none">
              <Grid items={priced} budget={search.budget} month={search.month} onOpen={setOpen} />
            </Tabs.Content>
          )}
          {unverified.length > 0 && (
            <Tabs.Content value="unverified" className="outline-none">
              <p className="mb-6 mt-0 max-w-prose text-muted">
                These fit your trip on travel and food. We haven't verified what places to stay cost there yet, so budget for that on top.
              </p>
              <Grid items={unverified} budget={search.budget} month={search.month} onOpen={setOpen} offset={priced.length} />
            </Tabs.Content>
          )}
        </Tabs.Root>
      )}

      {data.notes.filter(() => priced.length > 0).map((note) => (
        <p key={note} className="m-0 text-sm text-muted">
          {note}
        </p>
      ))}
      {data.exclusions.cost_unknown > 0 && !nothing && (
        <p className="m-0 text-sm text-muted">Some places aren't shown because we haven't verified enough of their prices for a trip like this.</p>
      )}

      <TripDrawer item={open} budget={search.budget} month={search.month} onClose={() => setOpen(null)} />
      <Link to="/app/trips" className="text-sm font-semibold text-primary">
        All your trips
      </Link>
    </div>
  );
}
