import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserPreferences } from "../../firebase/firebase";
import { getRecommendations } from "../../utils/api";
import ProgressBar from "./ProgressBar";

// Simplified QuizFormData to match the recommendation_logic.py parameters
interface QuizFormData {
  budget: number;
  destination_type: string;
  activity_type: string;
}

const QuizForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState("");
  const [formData, setFormData] = useState<QuizFormData>({
    budget: 20000,
    destination_type: "",
    activity_type: "",
  });
  // Fuzzy logic budget classification (mirroring the Python logic)
  const classifyBudget = (budget: number): string => {
    // Low budget membership function (trapezoid: 0-0-12000-18000)
    let lowScore = 0;
    if (budget <= 12000) {
      lowScore = 1;
    } else if (budget > 12000 && budget < 18000) {
      lowScore = (18000 - budget) / (18000 - 12000);
    }

    // Medium budget membership function (triangle: 15000-25000-35000)
    let mediumScore = 0;
    if (budget >= 15000 && budget <= 25000) {
      mediumScore = (budget - 15000) / (25000 - 15000);
    } else if (budget > 25000 && budget <= 35000) {
      mediumScore = (35000 - budget) / (35000 - 25000);
    }

    // High budget membership function (trapezoid: 32000-40000-50000-50000)
    let highScore = 0;
    if (budget >= 32000 && budget <= 40000) {
      highScore = (budget - 32000) / (40000 - 32000);
    } else if (budget > 40000) {
      highScore = 1;
    }

    // Determine the category with highest membership score
    if (lowScore >= mediumScore && lowScore >= highScore) {
      return "Low Budget";
    } else if (mediumScore >= lowScore && mediumScore >= highScore) {
      return "Medium Budget";
    } else {
      return "High Budget";
    }
  };

  // Update budget category whenever budget changes
  useEffect(() => {
    setBudgetCategory(classifyBudget(formData.budget));
  }, [formData.budget]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    // Convert numerical values to numbers
    if (name === "budget") {
      processedValue = Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // Get budget category color for visual feedback
  const getBudgetCategoryColor = (category: string): string => {
    switch (category) {
      case "Low Budget":
        return "text-green-600 bg-green-50 border-green-200";
      case "Medium Budget":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "High Budget":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Get budget range examples for each category
  const getBudgetExamples = (category: string): string => {
    switch (category) {
      case "Low Budget":
        return "Perfect for budget-friendly destinations like Yankari National Park, Argungu Fishing Festival";
      case "Medium Budget":
        return "Great for mid-range destinations like Obudu Mountain Resort, Ikogosi Warm Springs";
      case "High Budget":
        return "Ideal for premium destinations like Millennium Park Abuja, luxury resorts";
      default:
        return "";
    }
  };

  // Simplified quiz steps to match the api requirements
  const quizSteps = [
    // Step 1: Enhanced Budget Input
    {
      title: "What's your daily travel budget?",
      component: (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Budget per day (₦)
          </label>

          {/* Budget Input Field */}
          <div className="mb-4">
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              min="5000"
              max="50000"
              step="1000"
              placeholder="Enter your budget"
            />
          </div>

          {/* Budget Slider */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>₦5,000</span>
              <span>₦25,000</span>
              <span>₦50,000</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />

            {/* Budget markers */}
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Budget</span>
              <span>Comfort</span>
              <span>Luxury</span>
            </div>
          </div>

          {/* Budget Category Display */}
          <div
            className={`mt-4 p-4 rounded-lg border-2 ${getBudgetCategoryColor(
              budgetCategory
            )}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg">{budgetCategory}</h4>
                <p className="text-sm mt-1">
                  ₦{formData.budget.toLocaleString()} per day
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl">
                  {budgetCategory === "Low Budget" && "💰"}
                  {budgetCategory === "Medium Budget" && "🏨"}
                  {budgetCategory === "High Budget" && "✨"}
                </span>
              </div>
            </div>
            <p className="text-sm mt-2 opacity-80">
              {getBudgetExamples(budgetCategory)}
            </p>
          </div>

          {/* Budget Breakdown Preview */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">
              Estimated Daily Breakdown:
            </h5>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="font-medium">Accommodation</div>
                <div className="text-gray-600">
                  ₦{Math.round(formData.budget * 0.4).toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Food</div>
                <div className="text-gray-600">
                  ₦{Math.round(formData.budget * 0.3).toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Activities</div>
                <div className="text-gray-600">
                  ₦{Math.round(formData.budget * 0.3).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // Step 2: Destination Type
    {
      title: "What kind of destination are you looking for?",
      component: (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Destination Type
          </label>
          <select
            name="destination_type"
            value={formData.destination_type}
            onChange={handleChange}
            className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          >
            <option value="">Select your preferred destination type</option>
            <option value="Nature/Adventure">Nature & Adventure</option>
            <option value="Nature/Leisure">Nature & Leisure</option>
            <option value="Wildlife/Safari">Wildlife & Safari</option>
            <option value="Architecture/Adventure">
              Architecture & Adventure
            </option>
            <option value="Leisure/Urban">Urban Leisure</option>
            <option value="Nature/Relaxation">Nature & Relaxation</option>
            <option value="Cultural/Adventure">Cultural & Adventure</option>
            <option value="Historical/Nature">Historical & Nature</option>
            <option value="Historical/Cultural">Historical & Cultural</option>
            <option value="Leisure/Resort">Resort & Leisure</option>
          </select>

          {/* Show examples based on selection */}
          {formData.destination_type && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Great choice! This includes destinations like{" "}
                {formData.destination_type === "Nature/Adventure" &&
                  "Obudu Mountain Resort, Yankari National Park"}
                {formData.destination_type === "Nature/Leisure" &&
                  "Ikogosi Warm Springs, Oguta Lake"}
                {formData.destination_type === "Wildlife/Safari" &&
                  "Yankari National Park, Kainji National Park"}
                {formData.destination_type === "Cultural/Adventure" &&
                  "Osun-Osogbo Sacred Grove, Argungu Fishing Festival"}
                {formData.destination_type === "Historical/Cultural" &&
                  "Benin City Walls, Kano City Walls"}
                {formData.destination_type === "Leisure/Urban" &&
                  "Millennium Park Abuja, Tarkwa Bay Beach"}
              </p>
            </div>
          )}
        </div>
      ),
    },
    // Step 3: Activities
    {
      title: "What activities are you most interested in?",
      component: (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Activity Type
          </label>
          <select
            name="activity_type"
            value={formData.activity_type}
            onChange={handleChange}
            className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          >
            <option value="">Select your preferred activities</option>
            <option value="Hiking">Hiking & Trekking</option>
            <option value="Swimming">Swimming & Water Sports</option>
            <option value="Safari">Wildlife Safari</option>
            <option value="Picnic">Picnicking & Relaxation</option>
            <option value="Tour">Cultural & Historical Tours</option>
            <option value="Relaxation">Spa & Wellness</option>
            <option value="Shopping">Shopping & Markets</option>
            <option value="Boating">Boating & Water Activities</option>
            <option value="Photography">Photography & Sightseeing</option>
            <option value="Horse Riding">Horse Riding & Adventure</option>
          </select>

          {/* Show activity examples */}
          {formData.activity_type && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Perfect! You'll enjoy destinations that offer{" "}
                {formData.activity_type === "Hiking" &&
                  "mountain trails, forest walks, and scenic viewpoints"}
                {formData.activity_type === "Swimming" &&
                  "beaches, pools, warm springs, and water parks"}
                {formData.activity_type === "Safari" &&
                  "wildlife viewing, game drives, and nature photography"}
                {formData.activity_type === "Tour" &&
                  "guided tours, museums, and cultural experiences"}
                {formData.activity_type === "Relaxation" &&
                  "spas, peaceful environments, and wellness activities"}
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  const goToNextStep = () => {
    if (currentStep < quizSteps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Firebase
      await saveUserPreferences(formData);

      // Get recommendations from API
      const recommendations = await getRecommendations(formData);

      // Store recommendations in localStorage for now
      localStorage.setItem(
        "travelRecommendations",
        JSON.stringify(recommendations)
      );

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("There was an error processing your quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
        Travel Preference Quiz
      </h2>

      <ProgressBar currentStep={currentStep} totalSteps={quizSteps.length} />

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            {quizSteps[currentStep].title}
          </h3>
          {quizSteps[currentStep].component}
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded ${
              currentStep === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
          >
            Previous
          </button>

          {currentStep < quizSteps.length - 1 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button" // Changed from type="submit" to prevent automatic form submission
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.activity_type} // Add validation for the last field
              className={`px-4 py-2 rounded text-white ${
                isSubmitting || !formData.activity_type
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Get Recommendations"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
