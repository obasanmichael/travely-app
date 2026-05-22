import { Link } from "react-router-dom";
import { Calendar, ChevronRight } from "lucide-react";
import { useRecommendationHistory } from "../../hooks/useRecommendationHistory";
import { Spinner } from "../ui/Spinner";
import { Card } from "../ui/Card";
import { ButtonLink } from "../ui/Button";
import { formatRunDate } from "../../lib/format";

const HistoryPage = () => {
  const { runs, loading, error } = useRecommendationHistory();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[320px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center" padding="lg">
        <p className="text-secondary">{error}</p>
        <ButtonLink to="/survey" className="mt-4" variant="primary">
          Take the quiz
        </ButtonLink>
      </Card>
    );
  }

  if (runs.length === 0) {
    return (
      <Card className="text-center" padding="lg">
        <h1 className="text-2xl font-bold text-primary mb-2">No history yet</h1>
        <p className="text-secondary text-sm mb-6">
          Complete the travel quiz to start building your recommendation history.
        </p>
        <ButtonLink to="/survey" variant="primary">
          Take the travel quiz
        </ButtonLink>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          Recommendation history
        </h1>
        <p className="text-sm text-secondary mt-1">
          Past quiz runs and the destinations we matched for you.
        </p>
      </div>

      <ul className="space-y-3">
        {runs.map((run) => (
          <li key={run.id}>
            <Link
              to={`/history/${run.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-default bg-surface-raised px-5 py-4 hover:bg-surface-muted transition-colors"
            >
              <div className="min-w-0">
                <p className="font-medium text-primary truncate">
                  {run.preferences.destination_type || "Travel quiz"} ·{" "}
                  {run.preferences.activity_type || "Mixed activities"}
                </p>
                <p className="text-sm text-secondary mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  {formatRunDate(run.createdAt)}
                  <span className="text-muted">·</span>
                  {run.recommendations.length} destinations
                  <span className="text-muted">·</span>
                  {run.user_budget_category} budget
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPage;
