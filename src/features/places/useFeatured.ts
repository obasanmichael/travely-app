import { useEffect, useState } from "react";
import { getFeatured, type Destination } from "../../api/client";

/** Featured places for the home page. Failure just means no photos, never a broken page. */
export function useFeatured(limit = 7): Destination[] {
  const [places, setPlaces] = useState<Destination[]>([]);
  useEffect(() => {
    let cancelled = false;
    getFeatured(limit)
      .then((found) => !cancelled && setPlaces(found))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [limit]);
  return places;
}
