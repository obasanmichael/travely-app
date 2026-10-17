import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, getSaved, type Destination } from "../../api/client";
import { useAuth } from "../auth/authContext";
import { PlaceCard } from "../places/PlaceCard";
import { useSaved } from "./savedContext";

export function SavedPage() {
  const { user, isSignedIn } = useAuth();
  const { ids } = useSaved();
  const [places, setPlaces] = useState<Destination[] | null>(null);
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

  // Unsaving on this page removes the card straight away.
  const shown = places?.filter((p) => ids.has(p.id)) ?? null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <h1 className="m-0 text-3xl font-bold tracking-tight text-ink">Saved places</h1>
      {!isSignedIn && (
        <p className="mb-0 mt-3 max-w-prose text-ink-soft">
          You're browsing as a guest, so these are only on this device.{" "}
          <Link to="/signup?next=/app/saved" className="font-semibold text-lagoon underline">
            Create an account
          </Link>{" "}
          to keep them everywhere.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-alert-wash px-5 py-3 text-sm text-alert">
          {error}
        </p>
      )}
      {shown === null && !error && <p className="mt-8 text-ink-soft">Loading…</p>}
      {shown?.length === 0 && (
        <div className="mt-8 rounded-3xl bg-surface p-7 ring-1 ring-line">
          <p className="m-0 font-semibold text-ink">Nothing saved yet</p>
          <p className="mb-0 mt-1 text-ink-soft">Tap Save on any place to keep it here for later.</p>
          <Link to="/" className="mt-5 inline-block rounded-full bg-lagoon px-5 py-2.5 font-semibold text-white no-underline">
            Find places
          </Link>
        </div>
      )}
      {shown && shown.length > 0 && (
        <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((place) => (
            <li key={place.id}>
              <PlaceCard place={place} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
