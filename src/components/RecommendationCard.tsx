import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Thermometer,
  BadgeDollarSign,
  Shield,
  Users,
} from "lucide-react";

interface Recommendation {
  destination: string;
  state: string;
  destination_type: string;
  activities: string;
  climate: string;
  avg_cost_per_day: number;
  best_season: string;
  accommodation_type: string;
  safety_rating: number;
  accessibility: string;
  budget_category: string;
  score: number;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  rank,
}) => {
  // Function to get appropriate color for safety rating
  const getSafetyColor = (rating: number) => {
    if (rating >= 8.5) return "text-green-600";
    if (rating >= 7.5) return "text-yellow-600";
    return "text-orange-600";
  };

  // Function to get appropriate color for budget category
  const getBudgetColor = (category: string) => {
    if (category === "Low") return "bg-green-100 text-green-800";
    if (category === "Medium") return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  // Function to get image URL based on destination type
  const getImageUrl = (destType: string) => {
    // In a real app, you would use actual images for each destination
    // For now, we'll use placeholder images
    const destTypeLower = destType.toLowerCase();

    if (destTypeLower.includes("nature")) return "/api/placeholder/400/250";
    if (destTypeLower.includes("wildlife")) return "/api/placeholder/400/250";
    if (destTypeLower.includes("cultural")) return "/api/placeholder/400/250";
    if (destTypeLower.includes("leisure")) return "/api/placeholder/400/250";

    return "/api/placeholder/400/250";
  };

  // Generate a placeholder ID from the destination name
  const destId = recommendation.destination.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transition duration-300 hover:shadow-xl transform hover:-translate-y-1">
      {/* Rank badge */}
      <div className="absolute top-3 left-3 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold z-10">
        {rank}
      </div>

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={getImageUrl(recommendation.destination_type)}
          alt={recommendation.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-white mr-1" />
            <span className="text-white text-sm font-medium">
              {recommendation.state}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">
            {recommendation.destination}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getBudgetColor(
              recommendation.budget_category
            )}`}
          >
            {recommendation.budget_category} Budget
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {recommendation.destination_type}
        </p>

        {/* Key features */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-sm">
            <Shield className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            <span className={`${getSafetyColor(recommendation.safety_rating)}`}>
              {recommendation.safety_rating}/10 Safety
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            <span>{recommendation.accessibility} Access</span>
          </div>

          <div className="flex items-center text-sm">
            <BadgeDollarSign className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            <span>₦{recommendation.avg_cost_per_day.toLocaleString()}/day</span>
          </div>

          <div className="flex items-center text-sm">
            <Thermometer className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
            <span>{recommendation.climate} Climate</span>
          </div>
        </div>

        {/* Season */}
        <div className="flex items-center text-sm mb-4">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          <span>Best time: {recommendation.best_season}</span>
        </div>

        {/* Activities tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {recommendation.activities.split(", ").map((activity, i) => (
              <span
                key={i}
                className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>

        {/* View details link */}
        <Link
          to={`/destination/${destId}`}
          className="block w-full text-center py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RecommendationCard;
