import { Link, useNavigate } from "react-router-dom";
import { PlaceCard } from "../features/places/PlaceCard";
import { useFeatured } from "../features/places/useFeatured";
import { SearchSentence } from "../features/search/SearchSentence";
import { DEFAULT_SEARCH, newSearchKey, toParams } from "../features/search/searchState";
import { useMeta } from "../features/search/useMeta";
import { SeasonRibbon } from "../components/SeasonRibbon";

const STEPS = [
  {
    title: "Tell us your trip",
    body: "Your budget, how long, where from and what you enjoy. It takes under a minute.",
  },
  {
    title: "We price the whole thing",
    body: "Getting there, getting around, food and a place to stay, from published price data. You see a range, never a made-up number.",
  },
  {
    title: "Pick with reasons",
    body: "Each place says why it fits and when to go, with a month-by-month season ribbon so you don't arrive in the rains.",
  },
];

export function Home() {
  const navigate = useNavigate();
  const meta = useMeta();
  const featured = useFeatured();
  const [hero, ...rest] = featured;

  return (
    <main>
      <section className="bg-ink text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:pb-24 lg:pt-16">
          <div>
            <h1 className="m-0 mb-6 text-base font-semibold text-sun">Plan a trip that fits your budget</h1>
            {meta.status === "loading" && (
              <div aria-busy="true" className="animate-pulse">
                <div className="h-12 w-4/5 rounded bg-white/10" />
                <div className="mt-4 h-12 w-3/5 rounded bg-white/10" />
              </div>
            )}
            {meta.status === "error" && (
              <div role="alert" className="max-w-xl rounded-2xl bg-white/10 p-6">
                <p className="m-0 font-semibold">{meta.message}</p>
                <button type="button" onClick={meta.retry} className="mt-4 rounded-full bg-sun px-5 py-2.5 font-semibold text-ink">
                  Try again
                </button>
              </div>
            )}
            {meta.status === "ready" && (
              <SearchSentence
                tone="dark"
                meta={meta.meta}
                initial={DEFAULT_SEARCH}
                onSubmit={(search) => navigate(`/results?${toParams(search, newSearchKey())}`)}
              />
            )}
          </div>

          {hero?.photo && (
            <figure className="relative m-0 hidden overflow-hidden rounded-3xl lg:block">
              <img src={hero.photo.url} alt="" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-ink/80 p-5 backdrop-blur-sm">
                <p className="m-0 text-sm text-white/70">Pictured</p>
                <Link to={`/places/${hero.slug}`} className="text-lg font-bold text-white no-underline hover:underline">
                  {hero.name}, {hero.state}
                </Link>
                <div className="mt-3 [&_span]:!text-white/80">
                  <SeasonRibbon scores={hero.month_scores} />
                </div>
                <a href={hero.photo.file_page_url} target="_blank" rel="noreferrer" className="mt-3 block text-[11px] text-white/60">
                  Photo: {hero.photo.author}, {hero.photo.licence}
                </a>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {rest.length > 0 && (
        <section aria-labelledby="featured-title" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="featured-title" className="m-0 text-2xl font-bold tracking-tight text-ink">
            Places worth a look
          </h2>
          <p className="mb-0 mt-2 text-ink-soft">Yellow months on each ribbon are the best time to go.</p>
          <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 6).map((place) => (
              <li key={place.id}>
                <PlaceCard place={place} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="how-title" className="bg-lagoon-wash">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="how-title" className="m-0 text-2xl font-bold tracking-tight text-ink">
            How Travely works
          </h2>
          <ol className="mt-8 grid list-none gap-8 p-0 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lagoon text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="m-0 text-lg font-bold text-ink">{step.title}</h3>
                <p className="m-0 max-w-[38ch] text-[15px] text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
