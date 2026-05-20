import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type { RecommendationResponse } from "../components/types/types";

const STORAGE_KEY = "travelRecommendations";

interface UseRecommendationsOptions {
  fetchOnMount?: boolean;
}

interface UseRecommendationsResult {
  data: RecommendationResponse | null;
  hasRecommendations: boolean;
  loading: boolean;
  error: string | null;
}

export function useRecommendations(
  options: UseRecommendationsOptions = {}
): UseRecommendationsResult {
  const { fetchOnMount = false } = options;
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!fetchOnMount) return;

    let cancelled = false;

    const fetch = async () => {
      setError(null);

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          if (!cancelled) setData(JSON.parse(saved));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {

        const response = await axios.post<RecommendationResponse>(
          "http://localhost:8000/recommendations",
          {
            budget: 20000,
            destination_type: "Nature/Adventure",
            activity_type: "Hiking",
          }
        );

        if (!cancelled) {
          setData(response.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        if (!cancelled) {
          setError("Failed to load recommendations. Please try again later.");
          toast.error("Failed to load recommendations.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [fetchOnMount]);

  const hasRecommendations =
    data !== null && data.recommendations.length > 0;

  return { data, hasRecommendations, loading, error };
}

export function readStoredRecommendations(): RecommendationResponse | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}
