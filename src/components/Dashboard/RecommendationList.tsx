// import React from "react";
// import { Recommendation } from "../types/types";
// import RecommendationCard from "./RecommendationCard";

// interface RecommendationListProps {
//   recommendations: Recommendation[];
//   budgetCategory: string;
//   durationCategory: string | null;
// }

// const RecommendationList: React.FC<RecommendationListProps> = ({
//   recommendations,
//   budgetCategory,
//   durationCategory,
// }) => {
//   return (
//     <div className="mb-8">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">
//           Your Top Recommendations
//         </h2>
//         <div className="flex flex-wrap gap-2">
//           {budgetCategory && (
//             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//               Budget: {budgetCategory}
//             </span>
//           )}
//           {durationCategory && (
//             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
//               Duration: {durationCategory}
//             </span>
//           )}
//         </div>
//       </div>

//       {recommendations.length === 0 ? (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
//           <p className="text-yellow-700">
//             No recommendations found. Try adjusting your preferences in the
//             quiz.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {recommendations.map((recommendation, index) => (
//             <RecommendationCard
//               key={index}
//               recommendation={recommendation}
//               rank={index + 1}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecommendationList;
