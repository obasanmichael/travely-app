import React from "react";

interface RecommendationProps {
  recommendation: {
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
  };
}

const RecommendationCard: React.FC<RecommendationProps> = ({
  recommendation,
}) => {
  // Destructure all the properties we need from the recommendation
  const {
    destination,
    state,
    city,
    destination_type,
    activities,
    climate,
    avg_cost_per_day,
    best_season,
    accommodation_type,
    nearby_hotel,
    hotel_price_range,
    feeding_cost_range,
    necessities_range,
    budget_category,
    score,
  } = recommendation;

  // Format the cost to show with comma separations
  const formatCost = (cost: number) => {
    return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Create an array of activity items from the comma-separated activities string
  const activityList = activities
    .split(",")
    .map((activity) => activity.trim())
    .filter((activity) => activity);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header with destination name and score */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="text-xl font-bold">{destination}</h3>
        <span className="bg-white text-blue-600 rounded-full px-3 py-1 font-bold text-sm">
          {Math.round(score * 100)}% Match
        </span>
      </div>

      {/* Location info */}
      <div className="p-4 border-b">
        <div className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span className="text-gray-700">
            {city}, {state}
          </span>
        </div>
        <div className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            ></path>
          </svg>
          <span className="text-gray-700">{destination_type}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            ></path>
          </svg>
          <span className="text-gray-700">{climate} Climate</span>
        </div>
      </div>

      {/* Cost and Season */}
      <div className="p-4 border-b">
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="text-gray-700">
              ₦{formatCost(avg_cost_per_day)}/day
            </span>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {budget_category} Budget
          </span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <span className="text-gray-700">Best Season: {best_season}</span>
        </div>
      </div>

      {/* Cost Breakdown Section */}
      <div className="p-4 border-b bg-gray-50">
        <h4 className="font-semibold text-gray-800 mb-3">Cost Breakdown</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              <span className="text-sm text-gray-600">Feeding Cost:</span>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {feeding_cost_range}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                ></path>
              </svg>
              <span className="text-sm text-gray-600">Other Necessities:</span>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {necessities_range}
            </span>
          </div>
        </div>
      </div>

      {/* Accommodation */}
      <div className="p-4 border-b">
        <h4 className="font-semibold text-gray-800 mb-2">Accommodation</h4>
        <div className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
          <span className="text-gray-700">
            {nearby_hotel} ({accommodation_type})
          </span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2-2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          <span className="text-gray-700">
            Price Range: {hotel_price_range}
          </span>
        </div>
      </div>

      {/* Activities */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Activities</h4>
        <div className="flex flex-wrap gap-2">
          {activityList.length > 0 ? (
            activityList.map((activity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {activity}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No activities specified</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
