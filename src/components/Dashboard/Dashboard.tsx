import React from "react";
import { useDashboardUser } from "../../hooks/useDashboardUser";
import { useRecommendations } from "../../hooks/useRecommendations";
import { Spinner } from "../ui/Spinner";
import { WelcomeHero } from "./WelcomeHero";
import { EmptyRecommendations } from "./EmptyRecommendations";
import { AboutSection } from "./AboutSection";
import RecommendationsContainer from "./RecommendationsContainer";

const Dashboard: React.FC = () => {
  const { userName, loading: userLoading } = useDashboardUser();
  const { data, hasRecommendations, loading: recLoading } =
    useRecommendations();

  const loading = userLoading || recLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[320px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const showRecommendations = data !== null && data.recommendations.length > 0;

  return (
    <div className="space-y-6">
      <WelcomeHero
        userName={userName}
        hasRecommendations={hasRecommendations}
      />

      {showRecommendations ? (
        <RecommendationsContainer />
      ) : (
        <EmptyRecommendations />
      )}

      <AboutSection />
    </div>
  );
};

export default Dashboard;
