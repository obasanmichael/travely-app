import { useCallback, useEffect, useState } from "react";
import { ApiError, getMeta, type Meta } from "../../api/client";

type MetaState =
  | { status: "loading" }
  | { status: "ready"; meta: Meta }
  | { status: "error"; message: string };

export function useMeta(): MetaState & { retry: () => void } {
  const [state, setState] = useState<MetaState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    getMeta()
      .then((meta) => !cancelled && setState({ status: "ready", meta }))
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof ApiError ? error.message : "Couldn't load the form. Try again.";
        setState({ status: "error", message });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
