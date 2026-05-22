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
  feeding_cost_range: string;
  necessities_range: string;
  budget_category: string;
  score: number;
}

export interface RecommendationResponse {
  user_budget_category: string;
  recommendations: Recommendation[];
}

export interface UserPreferences extends QuizFormData {
  userId: string;
  createdAt?: unknown;
  lastUpdated?: unknown;
}

export interface RecommendationRun {
  id?: string;
  preferences: QuizFormData;
  user_budget_category: string;
  recommendations: Recommendation[];
  source: "api";
  apiVersion: string;
  createdAt?: unknown;
}

export interface UserSettings {
  displayName?: string | null;
  email?: string | null;
  bio?: string;
  newsletter?: boolean;
  push?: boolean;
  profilePrivate?: boolean;
}

export interface DestinationSummary {
  destination: string;
  state: string;
  city: string;
  destination_type: string;
  activities: string;
  climate: string;
  avg_cost_per_day: number;
  best_season: string;
  budget_category: string;
}

export interface ExploreFilters {
  state?: string;
  destination_type?: string;
  budget_band?: "low" | "medium" | "high";
  q?: string;
}
