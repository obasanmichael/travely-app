import { Wallet } from "lucide-react";
import RecommendationCard from "./RecommendationCard";
import { useRecommendations } from "../../hooks/useRecommendations";
import { Spinner } from "../ui/Spinner";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

const RecommendationsContainer = () => {
  const { data, loading, error } = useRecommendations({ fetchOnMount: true });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[280px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
        <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
      </Card>
    );
  }

  if (!data || data.recommendations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-primary tracking-tight">
            Your matches
          </h2>
          <p className="text-sm text-secondary mt-0.5">
            Destinations ranked by how well they fit your preferences
          </p>
        </div>
        <Badge variant="accent" className="self-start sm:self-center gap-1.5 px-3 py-1">
          <Wallet className="w-3.5 h-3.5" />
          {data.user_budget_category} budget
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data.recommendations.map((recommendation, index) => (
          <RecommendationCard
            key={`${recommendation.destination}-${index}`}
            recommendation={recommendation}
            rank={index + 1}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendationsContainer;
