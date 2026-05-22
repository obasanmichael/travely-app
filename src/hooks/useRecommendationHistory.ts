import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getRecommendationHistory } from "../firebase/firestore";
import type { RecommendationRun } from "../components/types/types";

interface UseRecommendationHistoryResult {
  runs: RecommendationRun[];
  loading: boolean;
  error: string | null;
}

export function useRecommendationHistory(): UseRecommendationHistoryResult {
  const { user } = useAuth();
  const [runs, setRuns] = useState<RecommendationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRuns([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const history = await getRecommendationHistory(user.uid);
        if (!cancelled) setRuns(history);
      } catch (err) {
        console.error("Error loading recommendation history:", err);
        if (!cancelled) {
          setError("Failed to load history.");
          toast.error("Failed to load recommendation history.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  return { runs, loading, error };
}
