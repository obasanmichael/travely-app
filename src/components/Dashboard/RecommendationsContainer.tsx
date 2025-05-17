import { useState, useEffect } from "react";
import RecommendationCard from "./RecommendationCard";
import axios from "axios";

const RecommendationsContainer = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample user preferences - in a real app these would come from a form
  const userPreferences = {
    budget: 15000,
    safety_rating: 5,
    accessibility: "Easy",
    destination_type: "Nature",
    climate: "Tropical",
    activity_type: "Hiking",
    travel_duration: "7",
    travel_goal: "Relaxation",
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "http://localhost:8000/recommendations",
          userPreferences
        );

        setRecommendations(response.data.recommendations);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError;
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

      {recommendations.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          <p>
            No recommendations found matching your criteria. Try adjusting your
            preferences.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={index} recommendation={recommendation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsContainer;
