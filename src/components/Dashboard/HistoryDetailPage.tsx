import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getRecommendationRunById } from "../../firebase/firestore";
import { runToResponse } from "../../services/recommendationService";
import { readCachedRecommendationRunById } from "../../lib/clientStorage";
import type { RecommendationRun } from "../types/types";
import { Spinner } from "../ui/Spinner";
import { Card } from "../ui/Card";
import RecommendationsContainer from "./RecommendationsContainer";
import { formatRunDate } from "../../lib/format";

const HistoryDetailPage = () => {
  const { runId } = useParams<{ runId: string }>();
  const { user } = useAuth();
  const [run, setRun] = useState<RecommendationRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !runId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const result =
          (await getRecommendationRunById(user.uid, runId)) ??
          readCachedRecommendationRunById<RecommendationRun>(user.uid, runId);
        if (!cancelled) {
          if (!result) setError("This recommendation run was not found.");
          setRun(result);
        }
      } catch {
        const cachedRun = readCachedRecommendationRunById<RecommendationRun>(
          user.uid,
          runId
        );
        if (!cancelled) {
          if (cachedRun) {
            setRun(cachedRun);
            setError(null);
          } else {
            setError("Failed to load this run.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.uid, runId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[320px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !run) {
    return (
      <Card className="text-center" padding="lg">
        <p className="text-secondary">{error ?? "Run not found."}</p>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 mt-4 text-travel-600 dark:text-travel-400 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to history
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-sm text-travel-600 dark:text-travel-400 font-medium mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to history
        </Link>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Quiz from {formatRunDate(run.createdAt)}
        </h1>
        <p className="text-sm text-secondary mt-1">
          {run.preferences.destination_type} · {run.preferences.activity_type} ·
          ₦{run.preferences.budget.toLocaleString()}/day
        </p>
      </div>

      <RecommendationsContainer data={runToResponse(run)} />
    </div>
  );
};

export default HistoryDetailPage;
