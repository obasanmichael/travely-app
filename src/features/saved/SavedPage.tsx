import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, getSaved, type Destination } from "../../api/client";
import { ButtonLink } from "../../ui/Button";
import { EmptyState } from "../../ui/EmptyState";
import { PageIntro } from "../../ui/PageIntro";
import { Reveal } from "../../ui/Reveal";
import { Skeleton } from "../../ui/Skeleton";
import { useAuth } from "../auth/authContext";
import { PlaceCard } from "../places/PlaceCard";
import { useSaved } from "./savedContext";

export function SavedPage() {
  const { user, isSignedIn } = useAuth();
  const { ids } = useSaved();
  const [places, setPlaces] = useState<Destination[] | null>(user ? null : []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPlaces([]);
      return;
    }
    let cancelled = false;
    getSaved()
      .then((found) => !cancelled && setPlaces(found))
      .catch((failure: unknown) => !cancelled && setError(failure instanceof ApiError ? failure.message : "Couldn't load your saved places."));
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Unsaving here removes the card straight away.
  const shown = places?.filter((p) => ids.has(p.id)) ?? null;

  return (
    <div>
      <PageIntro title="Saved places">
        Your shortlist.{" "}
        {!isSignedIn && (
          <>
            You're browsing as a guest, so it's only on this device.{" "}
            <Link to="/signup?next=/app/saved" className="font-semibold text-primary">
              Create an account
            </Link>{" "}
            to keep it everywhere.
          </>
        )}
      </PageIntro>
      {error && <p role="alert" className="rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">{error}</p>}
      {shown === null && !error && (
        <div aria-busy="true" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-72" />)}
        </div>
      )}
      {shown?.length === 0 && (
        <EmptyState
          Icon={Heart}
          title="Nothing saved yet"
          body="Tap Save on any place to keep it here for later."
          action={<ButtonLink to="/app/explore">Explore places</ButtonLink>}
        />
      )}
      {shown && shown.length > 0 && (
        <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((place, index) => (
            <li key={place.id}>
              <Reveal index={index}>
                <PlaceCard place={place} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
