import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { browseDestinations, getRuns, getSaved, type Destination, type RunSummary } from "../api/client";
import { PlaceCard } from "../features/places/PlaceCard";
import { describeTrip } from "../lib/trips";
import { useAuth } from "../features/auth/authContext";
import { monthName } from "../lib/format";
import { ButtonLink } from "../ui/Button";
import { Card } from "../ui/Card";
import { Reveal } from "../ui/Reveal";

function greeting(): string {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

export function OverviewPage() {
  const { user, isSignedIn } = useAuth();
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [saved, setSaved] = useState<Destination[]>([]);
  const [now, setNow] = useState<Destination[]>([]);
  const month = new Date().getMonth() + 1;
  const name = isSignedIn ? (user?.displayName || user?.email?.split("@")[0] || "").split(" ")[0] : "";

  useEffect(() => {
    let cancelled = false;
    browseDestinations({ month, pageSize: 3 })
      .then((page) => !cancelled && setNow(page.items))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [month]);

  // Don't create a guest session just to look at an empty dashboard.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getRuns().then((found) => !cancelled && setRuns(found.slice(0, 4))).catch(() => undefined);
    getSaved().then((found) => !cancelled && setSaved(found.slice(0, 4))).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [user]);

  const latest = runs[0];

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="m-0 font-serif text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] tracking-tight text-ink">
            {greeting()}
            {name ? `, ${name}` : ""}
          </h2>
          <p className="mb-0 mt-3 max-w-prose text-muted">Where to next? Tell us your budget and what you enjoy.</p>
        </div>
        <ButtonLink to="/app/plan" size="lg">
          <Sparkles className="h-5 w-5" aria-hidden="true" /> Plan a trip
        </ButtonLink>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Reveal>
          <Card className="h-full p-6">
            {latest ? (
              <>
                <p className="m-0 text-sm font-semibold text-primary">Your latest trip</p>
                <h3 className="m-0 mt-2 text-xl font-bold text-ink">{describeTrip(latest.inputs as never)}</h3>
                {latest.top_places.length > 0 && <p className="mb-0 mt-3 text-muted">Top picks: {latest.top_places.join(", ")}</p>}
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink to={`/app/trips/${latest.id}`} variant="secondary">
                    Open trip <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink to="/app/trips" variant="ghost">
                    All trips
                  </ButtonLink>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-start justify-center gap-3 py-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-wash text-primary">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="m-0 text-xl font-bold text-ink">Let's plan your first trip</h3>
                <p className="m-0 max-w-[46ch] text-muted">Eight quick questions, then places that fit your budget with what they'll really cost.</p>
                <ButtonLink to="/app/plan" className="mt-2">
                  Start the quiz
                </ButtonLink>
              </div>
            )}
          </Card>
        </Reveal>
        <Reveal index={1}>
          <Card className="h-full p-6">
            <div className="flex items-center justify-between">
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-primary">
                <Heart className="h-4 w-4" aria-hidden="true" /> Saved places
              </p>
              <Link to="/app/saved" className="text-sm font-semibold text-muted">
                View all
              </Link>
            </div>
            {saved.length > 0 ? (
              <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-3 p-0">
                {saved.map((place) => (
                  <li key={place.id}>
                    <Link to={`/app/places/${place.slug}`} className="group block overflow-hidden rounded-xl no-underline">
                      <div className="aspect-[4/3] overflow-hidden bg-primary-wash">
                        {place.photo && <img src={place.photo.url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                      </div>
                      <p className="m-0 mt-2 truncate text-sm font-semibold text-ink">{place.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-0 mt-4 text-muted">Tap Save on any place and it will show up here.</p>
            )}
          </Card>
        </Reveal>
      </div>

      {now.length > 0 && (
        <section aria-labelledby="now-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h3 id="now-title" className="m-0 text-2xl font-bold tracking-tight text-ink">
                Great in {monthName(month)}
              </h3>
              <p className="m-0 mt-1 text-muted">Places at their best right now.</p>
            </div>
            <ButtonLink to={`/app/explore?month=${month}`} variant="secondary" size="sm">
              See more
            </ButtonLink>
          </div>
          <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {now.map((place, index) => (
              <li key={place.id}>
                <Reveal index={index}>
                  <PlaceCard place={place} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
