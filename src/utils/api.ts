

// API service for connecting to the FastAPI backend
import { QuizFormData, RecommendationResponse } from '../components/types/types';

// const API_BASE_URL = "http://127.0.0.1:8000"; 
const API_BASE_URL = "https://travely-backend.onrender.com/"; 

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
