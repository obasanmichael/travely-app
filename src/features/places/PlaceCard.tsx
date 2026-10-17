import { Link } from "react-router-dom";
import type { Destination } from "../../api/client";
import { SaveButton } from "../../components/SaveButton";
import { SeasonRibbon } from "../../components/SeasonRibbon";

export function PlaceCard({ place }: { place: Destination }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className="relative aspect-[4/3] overflow-hidden bg-lagoon-wash">
        {place.photo && (
          <img
            src={place.photo.url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute right-3 top-3">
          <SaveButton destinationId={place.id} name={place.name} tone="dark" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="m-0 text-lg font-bold leading-tight text-ink">
            <Link to={`/places/${place.slug}`} className="text-ink no-underline after:absolute after:inset-0">
              {place.name}
            </Link>
          </h3>
          <p className="m-0 mt-0.5 text-sm text-ink-soft">{place.state}</p>
        </div>
        <SeasonRibbon scores={place.month_scores} />
      </div>
    </article>
  );
}
