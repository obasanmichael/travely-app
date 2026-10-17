import { useEffect, useState } from "react";
import { getSample, type PublicSample } from "../api/client";

/** The website's example trip. Failure just hides the example; the page still reads fine. */
export function useSample(): PublicSample | null {
  const [sample, setSample] = useState<PublicSample | null>(null);
  useEffect(() => {
    let cancelled = false;
    getSample()
      .then((found) => !cancelled && setSample(found))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  return sample;
}
