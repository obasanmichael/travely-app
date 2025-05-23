import { useState, useEffect } from "react";
import RecommendationCard from "./RecommendationCard";
import axios from "axios";

// Define the types based on the updated recommendation_logic.py
interface Recommendation {
  destination: string;
  state: string;
  city: string;
  destination_type: string;
  activities: string;
  climate: string;
  least_cost_per_day: number; // Updated field name to match Python output
  best_season: string;
  accommodation_type: string;
  nearby_hotel: string;
  hotel_price_range: string;
  feeding_cost_range: string; // Added field
  other_necessities_range: string; // Added field
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
        // First try to get from in-memory storage (avoiding localStorage)
        const savedRecommendations = sessionStorage.getItem(
          "travelRecommendations"
        );
        if (savedRecommendations) {
          const parsedData = JSON.parse(savedRecommendations);
          setRecommendationData(parsedData);
          setLoading(false);
          return;
        }

        // If not in sessionStorage, use default parameters
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

        // Save to sessionStorage for current session
        sessionStorage.setItem(
          "travelRecommendations",
          JSON.stringify(response.data)
        );
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations. Please try again later.");

        // Fallback: Create sample data based on the Nigerian destinations from your CSV structure
        const fallbackData: RecommendationResponse = {
          user_budget_category: "Medium",
          recommendations: [
            {
              destination: "Yankari National Park",
              state: "Bauchi",
              city: "Bauchi",
              destination_type: "nature/adventure",
              activities:
                "Wildlife viewing, Bird watching, Hot springs, Safari tours",
              climate: "Tropical savanna",
              least_cost_per_day: 15000,
              best_season: "November to March",
              accommodation_type: "Lodge",
              nearby_hotel: "Yankari Guest House",
              hotel_price_range: "₦8,000 - ₦12,000",
              feeding_cost_range: "₦2,500 - ₦4,000",
              other_necessities_range: "₦1,500 - ₦3,000",
              budget_category: "Low",
              score: 0.92,
            },
            {
              destination: "Obudu Mountain Resort",
              state: "Cross River",
              city: "Obudu",
              destination_type: "nature/adventure",
              activities:
                "Cable car rides, Hiking, Mountain climbing, Bird watching",
              climate: "Temperate highland",
              least_cost_per_day: 25000,
              best_season: "November to February",
              accommodation_type: "Resort",
              nearby_hotel: "Obudu Mountain Resort",
              hotel_price_range: "₦15,000 - ₦25,000",
              feeding_cost_range: "₦4,000 - ₦6,000",
              other_necessities_range: "₦2,000 - ₦4,000",
              budget_category: "Medium",
              score: 0.88,
            },
            {
              destination: "Ikogosi Warm Springs",
              state: "Ekiti",
              city: "Ikogosi",
              destination_type: "nature/adventure",
              activities: "Hot springs, Nature walks, Photography, Relaxation",
              climate: "Tropical rainforest",
              least_cost_per_day: 18000,
              best_season: "October to March",
              accommodation_type: "Resort",
              nearby_hotel: "Ikogosi Warm Springs Resort",
              hotel_price_range: "₦10,000 - ₦18,000",
              feeding_cost_range: "₦3,000 - ₦5,000",
              other_necessities_range: "₦2,000 - ₦3,500",
              budget_category: "Medium",
              score: 0.85,
            },
            {
              destination: "Olumo Rock",
              state: "Ogun",
              city: "Abeokuta",
              destination_type: "cultural/historical",
              activities:
                "Rock climbing, Historical tours, Cultural experiences, Photography",
              climate: "Tropical rainforest",
              least_cost_per_day: 12000,
              best_season: "November to March",
              accommodation_type: "Hotel",
              nearby_hotel: "Gateway Hotel Abeokuta",
              hotel_price_range: "₦6,000 - ₦10,000",
              feeding_cost_range: "₦2,000 - ₦3,500",
              other_necessities_range: "₦1,500 - ₦2,500",
              budget_category: "Low",
              score: 0.82,
            },
            {
              destination: "Nike Art Gallery",
              state: "Lagos",
              city: "Lagos",
              destination_type: "cultural/art",
              activities: "Art viewing, Cultural tours, Shopping, Photography",
              climate: "Tropical rainforest",
              least_cost_per_day: 20000,
              best_season: "November to March",
              accommodation_type: "Hotel",
              nearby_hotel: "Eko Hotel & Suites",
              hotel_price_range: "₦12,000 - ₦20,000",
              feeding_cost_range: "₦4,000 - ₦6,500",
              other_necessities_range: "₦2,500 - ₦4,000",
              budget_category: "Medium",
              score: 0.78,
            },
          ],
        };

        setRecommendationData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleRetry = () => {
    // Clear sessionStorage and retry fetching
    sessionStorage.removeItem("travelRecommendations");
    setRecommendationData(null);
    setError(null);
    // Re-trigger the useEffect by creating a state change
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
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

        sessionStorage.setItem(
          "travelRecommendations",
          JSON.stringify(response.data)
        );
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error && !recommendationData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recommendationData?.recommendations?.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">No recommendations found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Your Personalized Travel Recommendations
        </h2>
        <p className="text-gray-600">
          Discover amazing destinations across Nigeria tailored to your
          preferences and budget.
          {recommendationData && (
            <>
              <br />
              <span className="font-semibold">
                Budget Category: {recommendationData.user_budget_category}
              </span>
            </>
          )}
        </p>
        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Using sample data due to connection issues. {error}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendationData.recommendations.map((recommendation, index) => (
          <RecommendationCard
            key={`${recommendation.destination}-${index}`}
            recommendation={recommendation}
          />
        ))}
      </div>

      {recommendationData.recommendations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No recommendations match your criteria. Try adjusting your
            preferences.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsContainer;
