// // src/utils/api.ts

// export const getRecommendations = async (
//   budget: number,
//   safetyRating: number,
//   accessibility: string,
//   destinationType?: string,
//   climate?: string,
//   activityType?: string,
//   travelDuration?: number
// ) => {
//   try {
//     const response = await fetch("http://localhost:8000/recommendations", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         budget,
//         safety_rating: safetyRating,
//         accessibility,
//         destination_type: destinationType,
//         climate,
//         activity_type: activityType,
//         travel_duration: travelDuration,
//       }),
//     });

//     if (response.ok) {
//       return await response.json();
//     } else {
//       throw new Error("Error fetching recommendations");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// API service for connecting to the FastAPI backend
import { QuizFormData, RecommendationResponse } from '../components/types/types';

const API_BASE_URL = "http://127.0.0.1:8000"; // Change this to your actual API URL

export const getRecommendations = async (quizData: QuizFormData): Promise<RecommendationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get recommendations');
    }
    
    const data: RecommendationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
