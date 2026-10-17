import { useCallback, useEffect, useState } from "react";
import { ApiError, getTrip, type RunDetail } from "../../api/client";

export type TripState =
  | { status: "loading" }
  | { status: "ready"; trip: RunDetail }
  | { status: "error"; error: ApiError };

export function useTrip(runId: string): TripState & { retry: () => void } {
  const [state, setState] = useState<TripState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    getTrip(runId)
      .then((trip) => !cancelled && setState({ status: "ready", trip }))
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({ status: "error", error: error instanceof ApiError ? error : new ApiError("Couldn't load this trip. Try again.", 500, true) });
      });
    return () => {
      cancelled = true;
    };
  }, [runId, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
