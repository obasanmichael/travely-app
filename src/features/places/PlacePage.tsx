import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError, getDestination, type Destination } from "../../api/client";
import { SaveButton } from "../../components/SaveButton";
import { SeasonRibbon } from "../../components/SeasonRibbon";
import { monthName } from "../../lib/format";

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
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="m-0 text-3xl font-bold text-ink">{error.status === 404 ? "We couldn't find that place" : error.message}</h1>
        <Link to="/" className="mt-6 inline-block font-semibold text-lagoon underline">Find places</Link>
      </main>
    );
  }
  if (!place) return <main className="mx-auto w-full max-w-5xl px-4 py-16 text-ink-soft sm:px-6">Loading…</main>;

  return (
    <main>
      <section className="relative bg-ink">
        {place.photo && <img src={place.photo.url} alt="" className="h-[52vh] max-h-[560px] w-full object-cover opacity-90" />}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent">
          <div className="mx-auto flex max-w-5xl items-end justify-between gap-4 px-4 pb-8 pt-24 sm:px-6">
            <div>
              <h1 className="m-0 text-4xl font-bold tracking-tight text-white sm:text-5xl">{place.name}</h1>
              <p className="m-0 mt-2 text-white/80">{place.state}</p>
            </div>
            <SaveButton destinationId={place.id} name={place.name} tone="dark" />
          </div>
        </div>
      </section>
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          {place.description && <p className="m-0 max-w-prose text-lg text-ink">{place.description}</p>}
          {place.wikipedia_url && (
            <a href={place.wikipedia_url} target="_blank" rel="noreferrer" className="mt-4 inline-block font-semibold text-lagoon underline">
              Read more on Wikipedia
            </a>
          )}
          {place.photo && (
            <p className="mt-8 text-[13px] text-ink-soft">
              Photo:{" "}
              <a href={place.photo.file_page_url} target="_blank" rel="noreferrer" className="underline">
                {place.photo.author}, {place.photo.licence}
              </a>
            </p>
          )}
        </div>
        <aside className="flex flex-col gap-5 rounded-3xl bg-surface p-6 ring-1 ring-line">
          <h2 className="m-0 text-lg font-bold text-ink">When to go</h2>
          <SeasonRibbon scores={place.month_scores} />
          <p className="m-0 text-sm text-ink-soft">
            <strong className="text-ink">Best months: </strong>
            {bestMonthsText(place.best_months)}
          </p>
          <Link to="/" className="rounded-full bg-lagoon px-5 py-2.5 text-center font-semibold text-white no-underline">
            Plan a trip with my budget
          </Link>
        </aside>
      </div>
    </main>
  );
}
