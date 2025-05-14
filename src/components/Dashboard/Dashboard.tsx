// // import React, { useState, useEffect } from "react";
// // import { useLocation } from "react-router-dom";
// // import { db } from "../firebase/firebase";
// // import { collection, getDocs } from "firebase/firestore";
// // import { Loader2 } from "lucide-react";

// // const Dashboard: React.FC = () => {
// //   const location = useLocation();
// //   // const navigate = useNavigate();
// //   const [loading, setLoading] = useState(true);
// //   const [recommendations, setRecommendations] = useState<any[]>([]);

// //   useEffect(() => {
// //     const fetchRecommendations = async () => {
// //       setLoading(true);
// //       try {
// //         // Check if recommendations are passed from navigation state
// //         const stateData = location.state?.recommendations;

// //         if (stateData) {
// //           setRecommendations(stateData);
// //         } else {
// //           // Fetch from Firestore if not passed
// //           const querySnapshot = await getDocs(
// //             collection(db, "recommendations")
// //           );
// //           const fetchedRecs = querySnapshot.docs.map((doc) => doc.data());
// //           setRecommendations(fetchedRecs);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching recommendations:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchRecommendations();
// //   }, [location.state]);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen p-6 bg-gray-100">
// //       <h1 className="text-2xl font-bold mb-4">Recommended Destinations</h1>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //         {recommendations.map((rec: any, index: number) => (
// //           <div key={index} className="bg-white rounded-2xl shadow-md p-4">
// //             <h2 className="text-xl font-semibold">{rec[0]}</h2>
// //             <p className="text-gray-600">Score: {rec[1].toFixed(2)}</p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { db } from "../App";
// import { User } from "firebase/auth";
// import RecommendationCard from "../components/RecommendationCard";
// import {
//   Palmtree,
//   MapPin,
//   Activity,
//   Calendar,
//   Wallet,
//   Users,
//   CloudSun,
// } from "lucide-react";

// interface Recommendation {
//   destination: string;
//   state: string;
//   destination_type: string;
//   activities: string;
//   climate: string;
//   avg_cost_per_day: number;
//   best_season: string;
//   accommodation_type: string;
//   safety_rating: number;
//   accessibility: string;
//   budget_category: string;
//   score: number;
// }

// interface UserPreferences {
//   travel_goal: string;
//   activities: string[];
//   destination_type: string;
//   companions: string;
//   duration: string;
//   budget: number;
//   traveler_count: number;
//   climate: string;
//   hasCompletedOnboarding: boolean;
// }

// interface DashboardProps {
//   user: User;
// }

// const Dashboard: React.FC<DashboardProps> = ({ user }) => {
//   const [username, setUsername] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [hasCompletedOnboarding, setHasCompletedOnboarding] =
//     useState<boolean>(false);
//   const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
//   const [userPreferences, setUserPreferences] =
//     useState<UserPreferences | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);

//         // Fetch user data
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//           setUsername(
//             userDoc.data().username || user.displayName || "Traveler"
//           );
//           setHasCompletedOnboarding(
//             userDoc.data().hasCompletedOnboarding || false
//           );
//         }

//         // Fetch user preferences if onboarding is completed
//         if (userDoc.exists() && userDoc.data().hasCompletedOnboarding) {
//           const preferencesDoc = await getDoc(
//             doc(db, "user_preferences", user.uid)
//           );
//           if (preferencesDoc.exists()) {
//             setUserPreferences(preferencesDoc.data() as UserPreferences);

//             // Fetch recommendations if they exist
//             const recommendationsQuery = query(
//               collection(db, "recommendations"),
//               where("userId", "==", user.uid)
//             );

//             const recommendationsSnapshot = await getDocs(recommendationsQuery);
//             if (!recommendationsSnapshot.empty) {
//               const recsData = recommendationsSnapshot.docs[0].data();
//               setRecommendations(recsData.destinations || []);
//             } else {
//               // If no recommendations in Firestore, fetch from API
//               await fetchRecommendations(
//                 preferencesDoc.data() as UserPreferences
//               );
//             }
//           }
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchUserData();
//     }
//   }, [user]);

//   const fetchRecommendations = async (preferences: UserPreferences) => {
//     try {
//       // This would normally call your backend API
//       // For now, we'll simulate a response with sample data
//       const sampleRecommendations: Recommendation[] = [
//         {
//           destination: "Obudu Mountain Resort",
//           state: "Cross River",
//           destination_type: "Nature/Adventure",
//           activities: "Hiking, Cable Car, Nature Walk",
//           climate: "Cool",
//           avg_cost_per_day: 25000,
//           best_season: "Nov - Feb (Dry Season)",
//           accommodation_type: "Resort",
//           safety_rating: 8.5,
//           accessibility: "Moderate",
//           budget_category: "Medium",
//           score: 0.92,
//         },
//         {
//           destination: "Lekki Conservation Centre",
//           state: "Lagos",
//           destination_type: "Nature/Leisure",
//           activities: "Canopy Walk, Picnic",
//           climate: "Humid",
//           avg_cost_per_day: 18000,
//           best_season: "Dec - March",
//           accommodation_type: "Hotel",
//           safety_rating: 9,
//           accessibility: "Easy",
//           budget_category: "Medium",
//           score: 0.89,
//         },
//         {
//           destination: "Yankari Game Reserve",
//           state: "Bauchi",
//           destination_type: "Wildlife/Safari",
//           activities: "Safari, Hot Spring Bathing",
//           climate: "Hot",
//           avg_cost_per_day: 20000,
//           best_season: "Nov - Apr",
//           accommodation_type: "Lodge",
//           safety_rating: 7.5,
//           accessibility: "Moderate",
//           budget_category: "Medium",
//           score: 0.85,
//         },
//         {
//           destination: "Erin Ijesha Waterfalls",
//           state: "Osun",
//           destination_type: "Nature/Adventure",
//           activities: "Waterfall Climbing, Swimming",
//           climate: "Mild",
//           avg_cost_per_day: 12000,
//           best_season: "June - August",
//           accommodation_type: "Guest House",
//           safety_rating: 8,
//           accessibility: "Moderate",
//           budget_category: "Low",
//           score: 0.82,
//         },
//         {
//           destination: "Ikogosi Warm Springs",
//           state: "Ekiti",
//           destination_type: "Nature/Relaxation",
//           activities: "Nature Walk, Relaxation",
//           climate: "Mild",
//           avg_cost_per_day: 15000,
//           best_season: "Dec - March",
//           accommodation_type: "Resort",
//           safety_rating: 8.3,
//           accessibility: "Moderate",
//           budget_category: "Medium",
//           score: 0.78,
//         },
//       ];

//       setRecommendations(sampleRecommendations);

//       // In a real implementation, you would save these to Firestore
//       // await setDoc(doc(db, 'recommendations', user.uid), {
//       //   userId: user.uid,
//       //   destinations: sampleRecommendations,
//       //   timestamp: serverTimestamp()
//       // });
//     } catch (error) {
//       console.error("Error fetching recommendations:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Hero Section */}
//       <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 bg-opacity-90 backdrop-filter backdrop-blur-lg">
//         <div className="flex flex-col md:flex-row justify-between items-center">
//           <div className="mb-6 md:mb-0 md:w-1/2">
//             <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-800">
//               Welcome to Travely, {username}!
//             </h1>
//             <p className="text-lg text-gray-600 mb-6">
//               Discover the best travel destinations in Nigeria tailored just for
//               you.
//             </p>
//             {!hasCompletedOnboarding ? (
//               <Link
//                 to="/onboarding"
//                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 inline-flex items-center"
//               >
//                 <Palmtree className="mr-2 h-5 w-5" />
//                 Take the Travel Quiz
//               </Link>
//             ) : (
//               <div className="flex flex-wrap gap-3">
//                 <Link
//                   to="/onboarding"
//                   className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 inline-flex items-center"
//                 >
//                   <Activity className="mr-2 h-5 w-5" />
//                   Retake Quiz
//                 </Link>
//                 <button
//                   onClick={() =>
//                     window.scrollTo({
//                       top:
//                         document.getElementById("recommendations")?.offsetTop ||
//                         0,
//                       behavior: "smooth",
//                     })
//                   }
//                   className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 inline-flex items-center"
//                 >
//                   <MapPin className="mr-2 h-5 w-5" />
//                   See Recommendations
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="md:w-2/5">
//             <img
//               src="/api/placeholder/500/300"
//               alt="Nigerian landmarks collage"
//               className="rounded-lg shadow-lg"
//             />
//           </div>
//         </div>
//       </div>

//       {/* User Preferences Summary (if completed onboarding) */}
//       {hasCompletedOnboarding && userPreferences && (
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 bg-opacity-90 backdrop-filter backdrop-blur-lg">
//           <h2 className="text-2xl font-bold mb-4 text-green-800">
//             Your Travel Preferences
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center p-3 bg-green-50 rounded-lg">
//               <MapPin className="h-5 w-5 text-green-600 mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">Destination Type</p>
//                 <p className="font-medium">
//                   {userPreferences.destination_type}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center p-3 bg-green-50 rounded-lg">
//               <Activity className="h-5 w-5 text-green-600 mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">Travel Goal</p>
//                 <p className="font-medium">{userPreferences.travel_goal}</p>
//               </div>
//             </div>

//             <div className="flex items-center p-3 bg-green-50 rounded-lg">
//               <Calendar className="h-5 w-5 text-green-600 mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">Duration</p>
//                 <p className="font-medium">{userPreferences.duration} days</p>
//               </div>
//             </div>

//             <div className="flex items-center p-3 bg-green-50 rounded-lg">
//               <Wallet className="h-5 w-5 text-green-600 mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">Budget</p>
//                 <p className="font-medium">
//                   ₦{userPreferences.budget.toLocaleString()}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center p-3 bg-green-50 rounded-lg">
//               <Users className="h-5 w-5 text-green-600 mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">Companions</p>
//                 <p className="font-medium">{userPreferences.companions}</p>
//               </div>
//             </div>

//             <div className="flex items-center p-3 bg-green-50 rounded-lg">
//               <CloudSun className="h-5 w-5 text-green-600 mr-3" />
//               <div>
//                 <p className="text-sm text-gray-500">Climate</p>
//                 <p className="font-medium">{userPreferences.climate}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Recommendations */}
//       {hasCompletedOnboarding && recommendations.length > 0 && (
//         <div id="recommendations" className="mb-12">
//           <h2 className="text-2xl font-bold mb-6 text-green-800">
//             Your Top Recommendations
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {recommendations.map((recommendation, index) => (
//               <RecommendationCard
//                 key={index}
//                 recommendation={recommendation}
//                 rank={index + 1}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Call to action for those who haven't completed the quiz */}
//       {!hasCompletedOnboarding && (
//         <div className="bg-white rounded-2xl shadow-lg p-8 mt-12 text-center bg-opacity-90 backdrop-filter backdrop-blur-lg">
//           <h2 className="text-2xl font-bold mb-4 text-green-800">
//             Discover Your Perfect Nigerian Getaway
//           </h2>
//           <p className="text-lg text-gray-600 mb-6">
//             Take our quick travel quiz to get personalized recommendations based
//             on your preferences.
//           </p>
//           <Link
//             to="/onboarding"
//             className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full transition duration-300 inline-flex items-center"
//           >
//             <Palmtree className="mr-2 h-5 w-5" />
//             Start the Quiz
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RecommendationResponse } from "../types/types";
import RecommendationList from "./RecommendationList";
import { getCurrentUser } from "../../firebase/firebase";

const Dashboard: React.FC = () => {
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user info
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              to="/quiz"
              className="inline-block bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-700"
            >
              {recommendations ? "Retake Quiz" : "Take Travel Quiz"}
            </Link>
          </div>
        </div>
      </div>

      {recommendations ? (
        <RecommendationList
          recommendations={recommendations.recommendations}
          budgetCategory={recommendations.user_budget_category}
          durationCategory={recommendations.user_duration_category}
        />
      ) : (
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
              Start Quiz
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
          <li>Safety and Accessibility ratings from trusted sources</li>
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