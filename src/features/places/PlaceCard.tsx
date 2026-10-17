import { Link } from "react-router-dom";
import type { Destination } from "../../api/client";
import { SaveButton } from "../../components/SaveButton";
import { SeasonRibbon } from "../../components/SeasonRibbon";

export function PlaceCard({ place }: { place: Destination }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-primary-wash">
        {place.photo && (
          <img
            src={place.photo.url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute right-3 top-3 z-10">
          <SaveButton destinationId={place.id} name={place.name} tone="dark" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="m-0 text-lg font-bold leading-tight text-ink">
            <Link to={`/app/places/${place.slug}`} className="text-ink no-underline after:absolute after:inset-0">
              {place.name}
            </Link>
          </h3>
          <p className="m-0 mt-0.5 text-sm text-muted">{place.state}</p>
        </div>
        <SeasonRibbon scores={place.month_scores} />
      </div>
    </article>
  );
}
