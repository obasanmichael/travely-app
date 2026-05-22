import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getLatestRecommendationRun } from "../firebase/firestore";
import {
  getCachedRecommendations,
  runToResponse,
} from "../services/recommendationService";
import type { RecommendationResponse } from "../components/types/types";

interface UseRecommendationsResult {
  data: RecommendationResponse | null;
  hasRecommendations: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRecommendations(): UseRecommendationsResult {
  const { user } = useAuth();
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (uid: string) => {
    setError(null);
    setLoading(true);
    try {
      const latestRun = await getLatestRecommendationRun(uid);
      if (latestRun) {
        const response = runToResponse(latestRun);
        setData(response);
        return;
      }

      const cached = getCachedRecommendations(uid);
      setData(cached);
    } catch (err) {
      console.error("Error loading recommendations:", err);
      setError("Failed to load recommendations.");
      toast.error("Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }
    load(user.uid);
  }, [user?.uid]);

  const refresh = async () => {
    if (!user) return;
    await load(user.uid);
  };

  const hasRecommendations =
    data !== null && data.recommendations.length > 0;

  return { data, hasRecommendations, loading, error, refresh };
}
