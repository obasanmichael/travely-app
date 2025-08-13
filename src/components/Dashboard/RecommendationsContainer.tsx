import { useState, useEffect } from "react";
import RecommendationCard from "./RecommendationCard";
import axios from "axios";
import toast from "react-hot-toast";

// Define the types based on the recommendation_logic.py
interface Recommendation {
  destination: string;
  state: string;
  city: string;
  destination_type: string;
  activities: string;
  climate: string;
  avg_cost_per_day: number;
  best_season: string;
  accommodation_type: string;
  nearby_hotel: string;
  hotel_price_range: string;
  feeding_cost_range: string;
  necessities_range: string;
  budget_category: string;
  score: number;
}

interface RecommendationResponse {
  user_budget_category: string;
  recommendations: Recommendation[];
}

const RecommendationsContainer = () => {
  const [recommendationData, setRecommendationData] =
    useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        // First try to get from localStorage
        const savedRecommendations = localStorage.getItem(
          "travelRecommendations"
        );
        if (savedRecommendations) {
          setRecommendationData(JSON.parse(savedRecommendations));
          setLoading(false);
          return;
        }

        // If not in localStorage, use default parameters
        const defaultParams = {
          budget: 20000,
          destination_type: "Nature/Adventure",
          activity_type: "Hiking",
        };

        const response = await axios.post(
          "http://localhost:8000/recommendations",
          defaultParams
        );

        setRecommendationData(response.data);

        // Save to localStorage for future use
        localStorage.setItem(
          "travelRecommendations",
          JSON.stringify(response.data)
        );
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        toast.error("Failed to load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Your Personalized Travel Recommendations
      </h2>

      {recommendationData && (
        <div className="bg-blue-100 text-blue-800 p-4 rounded-md mb-6">
          <p className="font-medium">
            Your Budget Category: {recommendationData.user_budget_category}
          </p>
        </div>
      )}

      {!recommendationData ||
      recommendationData.recommendations.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          <p>
            No recommendations found matching your criteria. Try adjusting your
            preferences.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendationData.recommendations.map((recommendation, index) => (
            <RecommendationCard key={index} recommendation={recommendation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsContainer;
