import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError, getDestination, type Destination } from "../../api/client";
import { SaveButton } from "../../components/SaveButton";
import { SeasonRibbon } from "../../components/SeasonRibbon";
import { monthName } from "../../lib/format";
import { ButtonLink } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Skeleton } from "../../ui/Skeleton";

function bestMonthsText(months: number[]): string {
  if (months.length === 0) return "We don't have enough climate data to say.";
  if (months.length === 12) return "Any time of year.";
  return months.map(monthName).join(", ");
}

export function PlacePage() {
  const { slug = "" } = useParams();
  const [place, setPlace] = useState<Destination | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPlace(null);
    setError(null);
    getDestination(slug)
      .then((found) => !cancelled && setPlace(found))
      .catch((failure: unknown) => !cancelled && setError(failure instanceof ApiError ? failure : new ApiError("Couldn't load this place.", 500, true)));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <Card className="max-w-xl p-8">
        <h2 className="m-0 text-xl font-bold text-ink">{error.status === 404 ? "We couldn't find that place" : error.message}</h2>
        <ButtonLink to="/app/explore" variant="secondary" className="mt-5">
          Explore places
        </ButtonLink>
      </Card>
    );
  }
  if (!place) {
    return (
      <div aria-busy="true" className="flex flex-col gap-6">
        <Skeleton className="h-[320px] w-full rounded-3xl" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    );
  }

  return (
    <article className="flex flex-col gap-8">
      <Link to="/app/explore" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted no-underline hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to explore
      </Link>
      <div className="relative overflow-hidden rounded-3xl bg-night">
        {place.photo && <img src={place.photo.url} alt="" className="h-[min(52vh,480px)] w-full object-cover opacity-95" />}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
          <div>
            <h2 className="m-0 font-serif text-4xl leading-none tracking-tight text-white sm:text-6xl">{place.name}</h2>
            <p className="m-0 mt-2 text-white/80">{place.state}</p>
          </div>
          <SaveButton destinationId={place.id} name={place.name} tone="dark" />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          {place.description ? <p className="m-0 max-w-prose text-lg text-ink">{place.description}</p> : <p className="m-0 text-muted">We don't have a description for this place yet.</p>}
          {place.wikipedia_url && (
            <a href={place.wikipedia_url} target="_blank" rel="noreferrer" className="mt-4 inline-block font-semibold text-primary">
              Read more on Wikipedia
            </a>
          )}
          {place.photo && (
            <p className="mt-8 text-[13px] text-muted">
              Photo:{" "}
              <a href={place.photo.file_page_url} target="_blank" rel="noreferrer" className="underline">
                {place.photo.author}, {place.photo.licence}
              </a>
            </p>
          )}
        </div>
        <Card className="flex flex-col gap-5 p-6">
          <h3 className="m-0 text-lg font-bold text-ink">When to go</h3>
          <SeasonRibbon scores={place.month_scores} interactive size="lg" />
          <p className="m-0 text-sm text-muted">
            <strong className="text-ink">Best months: </strong>
            {bestMonthsText(place.best_months)}
          </p>
          <ButtonLink to="/app/plan">Plan a trip</ButtonLink>
        </Card>
      </div>
    </article>
  );
}
