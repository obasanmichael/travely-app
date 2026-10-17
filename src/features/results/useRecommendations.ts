import { captureException } from "@sentry/react";
import { useCallback, useEffect, useState } from "react";
import { ApiError, getRecommendations, type RecommendationResponse } from "../../api/client";
import { toRequest, type SearchState } from "../search/searchState";

export type ResultsState =
  | { status: "loading" }
  | { status: "ready"; data: RecommendationResponse }
  | { status: "error"; error: ApiError };

export function useRecommendations(search: SearchState, key: string | null) {
  const [state, setState] = useState<ResultsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const requestBody = JSON.stringify(toRequest(search));

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    setState({ status: "loading" });
    getRecommendations(JSON.parse(requestBody), key)
      .then((data) => !cancelled && setState({ status: "ready", data }))
      .catch((error: unknown) => {
        if (cancelled) return;
        if (!(error instanceof ApiError)) captureException(error);
        setState({
          status: "error",
          error: error instanceof ApiError ? error : new ApiError("Something went wrong. Try again.", 500, true),
        });
      });
    return () => {
      cancelled = true;
    };
  }, [requestBody, key, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
