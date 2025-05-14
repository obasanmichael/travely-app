import React from "react";
import { Recommendation } from "../types/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  rank,
}) => {
  // Convert activities string to array
  const activities = recommendation.activities
    .split(",")
    .map((act) => act.trim());

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Badge for ranking */}
      <div className="relative">
        <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-br-lg font-bold">
          #{rank}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {recommendation.destination}
            </h3>
            <p className="text-gray-600 text-sm mb-3">{recommendation.state}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
            {Math.round(recommendation.score * 100)}% Match
          </div>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">Type:</span>
              <span className="ml-1 text-sm font-medium">
                {recommendation.destination_type}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">Climate:</span>
              <span className="ml-1 text-sm font-medium">
                {recommendation.climate}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">Budget:</span>
              <span className="ml-1 text-sm font-medium">
                {recommendation.budget_category}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">Season:</span>
              <span className="ml-1 text-sm font-medium">
                {recommendation.best_season}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="ml-1 font-bold text-sm">
                {recommendation.safety_rating}
              </span>
              <span className="text-gray-500 text-xs ml-1">Safety</span>
            </div>
            <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
              {recommendation.accessibility} Access
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Cost per day:</p>
            <p className="font-bold text-lg text-blue-700">
              {formatCurrency(recommendation.avg_cost_per_day)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-1">Activities:</p>
          <div className="flex flex-wrap gap-1">
            {activities.map((activity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-gray-500 text-xs">Accommodation:</p>
          <p className="text-sm">{recommendation.accommodation_type}</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
