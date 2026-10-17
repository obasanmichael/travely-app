import { Compass, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ApiError, browseDestinations, type Destination } from "../../api/client";
import { monthName } from "../../lib/format";
import { Button } from "../../ui/Button";
import { EmptyState } from "../../ui/EmptyState";
import { PageIntro } from "../../ui/PageIntro";
import { Reveal } from "../../ui/Reveal";
import { Select } from "../../ui/Select";
import { Skeleton } from "../../ui/Skeleton";
import { PlaceCard } from "../places/PlaceCard";
import { useMeta } from "../search/useMeta";

const PAGE_SIZE = 24;

export function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const meta = useMeta();
  const q = params.get("q") ?? "";
  const state = params.get("state") ?? "";
  const interest = params.get("interest") ?? "";
  const month = Number(params.get("month")) || 0;
  const [text, setText] = useState(q);
  const [items, setItems] = useState<Destination[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, value: string) =>
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace: true });

  // Typing waits for a pause before it filters.
  useEffect(() => {
    const timer = setTimeout(() => text !== q && set("q", text.trim()), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    browseDestinations({ q, state, interest, month: month || undefined, page, pageSize: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return;
        setItems((current) => (page === 1 ? result.items : [...current, ...result.items]));
        setTotal(result.total);
      })
      .catch((failure: unknown) => !cancelled && setError(failure instanceof ApiError ? failure.message : "Couldn't load places. Try again."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [q, state, interest, month, page]);

  useEffect(() => setPage(1), [q, state, interest, month]);

  const filtered = Boolean(q || state || interest || month);
  const clear = () => {
    setText("");
    setParams({}, { replace: true });
  };

  return (
    <div>
      <PageIntro title="Explore places">Browse everything we cover. Yellow months on a ribbon are the best time to go.</PageIntro>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="relative block">
          <span className="sr-only">Search places</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search by place or state"
            className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-[15px] text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
          />
        </label>
        <Select label="State" value={state} onChange={(e) => set("state", e.target.value)}>
          <option value="">Any state</option>
          {meta.status === "ready" && meta.meta.states.map((s) => <option key={s.iso} value={s.iso}>{s.name}</option>)}
        </Select>
        <Select label="Interest" value={interest} onChange={(e) => set("interest", e.target.value)}>
          <option value="">Any interest</option>
          {meta.status === "ready" && meta.meta.interests.map((i) => <option key={i.slug} value={i.slug}>{i.label}</option>)}
        </Select>
        <Select label="Great in" value={month ? String(month) : ""} onChange={(e) => set("month", e.target.value)}>
          <option value="">Any month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>Great in {monthName(m)}</option>)}
        </Select>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          Icon={Compass}
          title="No places match"
          body="Try a different state or interest, or clear the filters to see everything."
          action={filtered ? <Button onClick={clear}>Clear filters</Button> : undefined}
        />
      )}

      {items.length > 0 && (
        <>
          <p className="mb-4 mt-0 text-sm text-muted" aria-live="polite">
            {total.toLocaleString("en-NG")} {total === 1 ? "place" : "places"}
          </p>
          <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((place, index) => (
              <li key={place.id}>
                <Reveal index={index % PAGE_SIZE > 8 ? 0 : index}>
                  <PlaceCard place={place} />
                </Reveal>
              </li>
            ))}
          </ul>
        </>
      )}

      {loading && (
        <ul aria-hidden="true" className="m-0 mt-6 grid list-none gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <Skeleton className="h-72" />
            </li>
          ))}
        </ul>
      )}

      {!loading && items.length < total && (
        <div className="mt-10 flex justify-center">
          <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
            Show more places
          </Button>
        </div>
      )}
    </div>
  );
}
