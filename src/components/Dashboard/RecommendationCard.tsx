// import React from "react";
// import { Recommendation } from "../types/types";

// interface RecommendationCardProps {
//   recommendation: Recommendation;
//   rank: number;
// }

// const RecommendationCard: React.FC<RecommendationCardProps> = ({
//   recommendation,
//   rank,
// }) => {
//   // Convert activities string to array
//   const activities = recommendation.activities
//     .split(",")
//     .map((act) => act.trim());

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
//       {/* Badge for ranking */}
//       <div className="relative">
//         <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-br-lg font-bold">
//           #{rank}
//         </div>
//       </div>

//       <div className="p-5">
//         <div className="flex justify-between items-start">
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-1">
//               {recommendation.destination}
//             </h3>
//             <p className="text-gray-600 text-sm mb-3">{recommendation.state}</p>
//           </div>
//           <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
//             {Math.round(recommendation.score * 100)}% Match
//           </div>
//         </div>

//         <div className="mb-4">
//           <div className="grid grid-cols-2 gap-2 mb-3">
//             <div className="flex items-center">
//               <span className="text-gray-500 text-sm">Type:</span>
//               <span className="ml-1 text-sm font-medium">
//                 {recommendation.destination_type}
//               </span>
//             </div>
//             <div className="flex items-center">
//               <span className="text-gray-500 text-sm">Climate:</span>
//               <span className="ml-1 text-sm font-medium">
//                 {recommendation.climate}
//               </span>
//             </div>
//             <div className="flex items-center">
//               <span className="text-gray-500 text-sm">Budget:</span>
//               <span className="ml-1 text-sm font-medium">
//                 {recommendation.budget_category}
//               </span>
//             </div>
//             <div className="flex items-center">
//               <span className="text-gray-500 text-sm">Season:</span>
//               <span className="ml-1 text-sm font-medium">
//                 {recommendation.best_season}
//               </span>
//             </div>
//           </div>

//           <div className="flex justify-between items-center mb-3">
//             <div className="flex items-center">
//               <svg
//                 className="w-4 h-4 text-yellow-500"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//               </svg>
//               <span className="ml-1 font-bold text-sm">
//                 {recommendation.safety_rating}
//               </span>
//               <span className="text-gray-500 text-xs ml-1">Safety</span>
//             </div>
//             <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
//               {recommendation.accessibility} Access
//             </div>
//           </div>

//           <div>
//             <p className="text-gray-500 text-sm mb-1">Cost per day:</p>
//             <p className="font-bold text-lg text-blue-700">
//               {formatCurrency(recommendation.avg_cost_per_day)}
//             </p>
//           </div>
//         </div>

//         <div>
//           <p className="text-gray-500 text-sm mb-1">Activities:</p>
//           <div className="flex flex-wrap gap-1">
//             {activities.map((activity, index) => (
//               <span
//                 key={index}
//                 className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
//               >
//                 {activity}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="mt-4 pt-3 border-t border-gray-200">
//           <p className="text-gray-500 text-xs">Accommodation:</p>
//           <p className="text-sm">{recommendation.accommodation_type}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecommendationCard;

// import React from 'react';

interface RecommendationProps {
  recommendation: {
    destination: string
    state: string
    city: string
    destination_type: string
    activities: string
    climate: string
    avg_cost_per_day: number
    best_season: string
    accommodation_type: string
    safety_rating: number
    accessibility: string
    budget_category: string
    nearby_hotel: string
    hotel_price_range: number
    score: number
  };
}

const RecommendationCard: React.FC<RecommendationProps> = ({ recommendation }) => {
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
    safety_rating,
    accessibility,
    budget_category,
    nearby_hotel,
    hotel_price_range,
    score
  } = recommendation;

  // Format the cost to show with comma separations
  const formatCost = (cost: number) => {
    return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate a visual representation of the safety rating (using stars)
  const renderSafetyStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 10; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  // Handle different accessibility levels with appropriate styles
  const getAccessibilityBadgeColor = (accessibility: string) => {
    switch (accessibility.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Create an array of activity items from the comma-separated activities string
  const activityList = activities.split(',').map(activity => activity.trim());

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
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span className="text-gray-700">{city}, {state}</span>
        </div>
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          <span className="text-gray-700">{destination_type}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
          </svg>
          <span className="text-gray-700">{climate} Climate</span>
        </div>
      </div>

      {/* Cost and Season */}
      <div className="p-4 border-b">
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-gray-700">₦{formatCost(avg_cost_per_day)}/day</span>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {budget_category} Budget
          </span>
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span className="text-gray-700">Best Season: {best_season}</span>
        </div>
      </div>

      {/* Accommodation */}
      <div className="p-4 border-b">
        <h4 className="font-semibold text-gray-800 mb-2">Accommodation</h4>
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <span className="text-gray-700">{nearby_hotel} ({accommodation_type})</span>
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span className="text-gray-700">Price Range: ₦{hotel_price_range}</span>
        </div>
      </div>

      {/* Activities */}
      <div className="p-4 border-b">
        <h4 className="font-semibold text-gray-800 mb-2">Activities</h4>
        <div className="flex flex-wrap gap-2">
          {activityList.map((activity, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {activity}
            </span>
          ))}
        </div>
      </div>

      {/* Safety and Accessibility */}
      <div className="p-4">
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-gray-700 text-sm font-medium">Safety Rating</span>
            <span className="text-gray-700 text-sm font-medium">{safety_rating}/10</span>
          </div>
          <div className="flex">
            {renderSafetyStars(safety_rating)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-sm font-medium">Accessibility</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessibilityBadgeColor(accessibility)}`}>
            {accessibility}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;