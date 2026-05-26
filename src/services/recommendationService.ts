import { getRecommendations } from "../api/client";
import {
  markOnboardingComplete,
  saveRecommendationRun,
  saveUserPreferences,
} from "../firebase/firestore";
import {
  cacheRecommendationRun,
  cacheRecommendations,
  readCachedRecommendations,
} from "../lib/clientStorage";
import type {
  QuizFormData,
  RecommendationResponse,
  RecommendationRun,
} from "../components/types/types";

async function persistRecommendationRun(
  uid: string,
  quizData: QuizFormData,
  response: RecommendationResponse
): Promise<void> {
  try {
    await saveUserPreferences(uid, quizData);
    await saveRecommendationRun(uid, quizData, response);
    await markOnboardingComplete(uid);
  } catch (err) {
    console.error("Failed to persist recommendation result:", err);
  }
}

export async function submitQuizAndGetRecommendations(
  uid: string,
  quizData: QuizFormData
): Promise<RecommendationResponse> {
  const response = await getRecommendations(quizData);
  cacheRecommendations(uid, response);

  const localRun: RecommendationRun = {
    id: `local-${Date.now()}`,
    preferences: quizData,
    user_budget_category: response.user_budget_category,
    recommendations: response.recommendations,
    source: "api",
    apiVersion: "2.0.0",
    createdAt: new Date().toISOString(),
  };
  cacheRecommendationRun(uid, localRun);
  void persistRecommendationRun(uid, quizData, response);

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
