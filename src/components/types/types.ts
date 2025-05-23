// Type definitions for the application
// Common types used across the application

export interface QuizFormData {
    budget: number;
    destination_type: string;
    activity_type: string;
  }
  
  export interface Recommendation {
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
    budget_category: string;
    score: number;
  }
  
  export interface RecommendationResponse {
    user_budget_category: string;
    recommendations: Recommendation[];
  }
  
  export interface UserPreferences extends QuizFormData {
    userId: string;
    createdAt: Date;
    lastUpdated: Date;
  }