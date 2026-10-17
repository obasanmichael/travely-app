import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, getSaved, setSaved } from "../../api/client";
import { useAuth } from "../auth/authContext";
import { SavedContext, type SavedValue } from "./savedContext";

export function SavedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<ReadonlySet<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // No session yet means nothing saved; don't create a guest account just to look.
    if (!user) {
      setIds(new Set());
      return;
    }
    let cancelled = false;
    getSaved()
      .then((places) => !cancelled && setIds(new Set(places.map((p) => p.id))))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [user, version]);

  const toggle = useCallback(async (destinationId: string) => {
    let wasSaved = false;
    setIds((current) => {
      wasSaved = current.has(destinationId);
      const next = new Set(current);
      if (wasSaved) next.delete(destinationId);
      else next.add(destinationId);
      return next;
    });
    setError(null);
    try {
      await setSaved(destinationId, !wasSaved);
    } catch (failure) {
      setIds((current) => {
        const reverted = new Set(current);
        if (wasSaved) reverted.add(destinationId);
        else reverted.delete(destinationId);
        return reverted;
      });
      setError(failure instanceof ApiError ? failure.message : "Couldn't update your saved places. Try again.");
    }
  }, []);

  const value = useMemo<SavedValue>(
    () => ({ ids, error, toggle, refresh: () => setVersion((v) => v + 1) }),
    [ids, error, toggle]
  );
  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}
