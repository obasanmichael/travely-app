import { getRecommendations } from "../api/client";
import {
  markOnboardingComplete,
  saveRecommendationRun,
  saveUserPreferences,
} from "../firebase/firestore";
import {
  cacheRecommendations,
  readCachedRecommendations,
} from "../lib/clientStorage";
import type {
  QuizFormData,
  RecommendationResponse,
} from "../components/types/types";

export async function submitQuizAndGetRecommendations(
  uid: string,
  quizData: QuizFormData
): Promise<RecommendationResponse> {
  await saveUserPreferences(uid, quizData);
  const response = await getRecommendations(quizData);
  await saveRecommendationRun(uid, quizData, response);
  await markOnboardingComplete(uid);
  cacheRecommendations(uid, response);
  return response;
}

export function getCachedRecommendations(
  uid: string
): RecommendationResponse | null {
  return readCachedRecommendations<RecommendationResponse>(uid);
}

export function runToResponse(run: {
  user_budget_category: string;
  recommendations: RecommendationResponse["recommendations"];
}): RecommendationResponse {
  return {
    user_budget_category: run.user_budget_category,
    recommendations: run.recommendations,
  };
}
