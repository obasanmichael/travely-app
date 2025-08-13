import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../firebase/firebase";
import RecommendationsContainer from "./RecommendationsContainer";

// Simplified for the MVP
interface RecommendationResponse {
  user_budget_category: string;
  recommendations: any[];
}

const Dashboard: React.FC = () => {
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserName(
            user.displayName || user.email?.split("@")[0] || "Traveler"
          );
        }
        // Get recommendations from localStorage
        const savedRecommendations = localStorage.getItem(
          "travelRecommendations"
        );
        if (savedRecommendations) {
          setRecommendations(JSON.parse(savedRecommendations));
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome{userName ? `, ${userName}` : ""}!
            </h1>
            <p className="mt-1 text-gray-600">
              Discover your perfect Nigerian travel destination
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/dashboard/survey"
              className="inline-block bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-700"
            >
              {recommendations ? "Retake questions" : "Answer Travel Questions"}
            </Link>
          </div>
        </div>
      </div>

      {recommendations ? 
        <RecommendationsContainer />
       : (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Recommendations Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Take our travel quiz to get personalized destination
              recommendations in Nigeria
            </p>
            <Link
              to="/quiz"
              className="inline-block bg-blue-600 text-white rounded-lg px-5 py-3 text-sm font-medium hover:bg-blue-700"
            >
              Start Form Filling
            </Link>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          About Our Recommendation System
        </h2>
        <p className="text-blue-700 mb-2">
          Our travel recommendation system uses:
        </p>
        <ul className="list-disc list-inside text-blue-700 space-y-1 mb-4">
          <li>Fuzzy Logic for budget classification</li>
          <li>Content-Based Filtering for personalized recommendations</li>
          <li>Destination and Activity matching to find your perfect trip</li>
        </ul>
        <p className="text-blue-700 text-sm">
          We analyze your preferences to match you with the ideal Nigerian
          destinations that fit your travel style, budget, and interests.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
