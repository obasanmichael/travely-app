// // src/types/types.ts

// // User related types
// export interface UserPreferences {
//   travelerType?: string;
//   activities?: string[];
//   tripDuration?: string;
//   dailyBudget?: number;
//   planningTimeframe?: string;
//   onboardingCompleted?: boolean;
// }

// export interface UserProfile {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   photoURL: string | null;
//   preferences?: UserPreferences;
//   createdAt?: Date;
// }

// // Destination related types
// export interface Destination {
//   id: string;
//   name: string;
//   description: string;
//   location: string;
//   region?: string;
//   country?: string;
//   imageUrl: string;
//   images?: string[];
//   price?: number; // Starting price per person
//   rating?: number;
//   reviewCount?: number;
//   highlights?: string[];
//   bestTimeToVisit?: string;
//   travelStyles?: string[];
//   activities?: string[];
//   latitude?: number;
//   longitude?: number;
//   featured?: boolean;
//   popularity?: number;
//   views?: number;
// }

// // Booking related types
// export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

// export interface Traveler {
//   firstName: string;
//   lastName: string;
//   email?: string;
//   phone?: string;
//   dateOfBirth?: string;
//   passportNumber?: string;
//   specialRequirements?: string;
// }

// export interface BookingDetails {
//   startDate: Date;
//   endDate: Date;
//   numTravelers: number;
//   travelers: Traveler[];
//   totalPrice: number;
//   accommodationType?: string;
//   transportationType?: string;
//   activities?: string[];
//   notes?: string;
// }

// export interface Booking {
//   id: string;
//   userId: string;
//   destinationId: string;
//   destination?: Destination;
//   details: BookingDetails;
//   status: BookingStatus;
//   paymentStatus: "pending" | "partial" | "paid";
//   createdAt: Date;
//   updatedAt?: Date;
// }

// // Trip planning types
// export interface TripPlan {
//   id: string;
//   userId: string;
//   name: string;
//   destinations: Destination[];
//   startDate?: Date;
//   endDate?: Date;
//   budget?: number;
//   notes?: string;
//   isPublic?: boolean;
//   createdAt: Date;
//   updatedAt?: Date;
// }

// export interface Itinerary {
//   tripId: string;
//   days: ItineraryDay[];
// }

// export interface ItineraryDay {
//   date: Date;
//   dayNumber: number;
//   activities: ItineraryActivity[];
//   accommodation?: Accommodation;
//   transportation?: Transportation;
//   notes?: string;
// }

// export interface ItineraryActivity {
//   name: string;
//   description?: string;
//   location?: string;
//   startTime?: string;
//   endTime?: string;
//   cost?: number;
//   bookingReference?: string;
//   notes?: string;
// }

// export interface Accommodation {
//   name: string;
//   type: string;
//   location: string;
//   checkIn: string;
//   checkOut: string;
//   bookingReference?: string;
//   cost?: number;
//   amenities?: string[];
//   notes?: string;
// }

// export interface Transportation {
//   type: string;
//   from: string;
//   to: string;
//   departureTime?: string;
//   arrivalTime?: string;
//   bookingReference?: string;
//   cost?: number;
//   notes?: string;
// }

// // Review related types
// export interface Review {
//   id: string;
//   userId: string;
//   userName: string;
//   userImage?: string;
//   destinationId: string;
//   rating: number;
//   title: string;
//   comment: string;
//   images?: string[];
//   travelDate?: Date;
//   createdAt: Date;
//   helpfulCount?: number;
// }

// // Search and filter types
// export interface SearchFilters {
//   location?: string;
//   priceRange?: [number, number];
//   travelStyle?: string[];
//   season?: string;
//   activities?: string[];
//   rating?: number;
//   duration?: string;
// }

// // Notification types
// export type NotificationType =
//   | "booking"
//   | "promo"
//   | "system"
//   | "trip"
//   | "review";

// export interface Notification {
//   id: string;
//   userId: string;
//   type: NotificationType;
//   title: string;
//   message: string;
//   read: boolean;
//   actionUrl?: string;
//   createdAt: Date;
// }

// Type definitions for the application
export interface QuizFormData {
    budget: number;
    safety_rating: number;
    accessibility: string;
    destination_type: string;
    climate: string;
    activity_type: string;
    travel_duration: string;
    companions: string;
    travel_goal: string;
    traveler_count: number;
  }
  
  export interface Recommendation {
    destination: string;
    state: string;
    destination_type: string;
    activities: string;
    climate: string;
    avg_cost_per_day: number;
    best_season: string;
    accommodation_type: string;
    safety_rating: number;
    accessibility: string;
    budget_category: string;
    score: number;
  }
  
  export interface RecommendationResponse {
    user_budget_category: string;
    user_duration_category: string | null;
    recommendations: Recommendation[];
  }
  
  export interface UserPreferences extends QuizFormData {
    userId: string;
    createdAt: Date;
    lastUpdated: Date;
  }