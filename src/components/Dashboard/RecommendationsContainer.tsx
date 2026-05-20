import { Wallet } from "lucide-react";
import RecommendationCard from "./RecommendationCard";
import type { RecommendationResponse } from "../types/types";
import { Badge } from "../ui/Badge";

interface RecommendationsContainerProps {
  data: RecommendationResponse;
}

const RecommendationsContainer = ({ data }: RecommendationsContainerProps) => {
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
