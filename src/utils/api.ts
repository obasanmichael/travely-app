// src/utils/api.ts

export const getRecommendations = async (
  budget: number,
  safetyRating: number,
  accessibility: string,
  destinationType?: string,
  climate?: string,
  activityType?: string,
  travelDuration?: number
) => {
  try {
    const response = await fetch("http://localhost:8000/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        budget,
        safety_rating: safetyRating,
        accessibility,
        destination_type: destinationType,
        climate,
        activity_type: activityType,
        travel_duration: travelDuration,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Error fetching recommendations");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
