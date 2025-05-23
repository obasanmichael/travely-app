import React, { useState } from "react";
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
  const [formData, setFormData] = useState<QuizFormData>({
    budget: 20000,
    destination_type: "",
    activity_type: "",
  });

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

  // Simplified quiz steps to match the api requirements
  const quizSteps = [
    // Step 1: Budget
    {
      title: "What's your budget per day?",
      component: (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Budget per day (₦)
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min="5000"
            max="50000"
          />
          <div className="mt-2 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>₦5,000</span>
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
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
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
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select destination type</option>
            <option value="Nature/Adventure">Nature/Adventure</option>
            <option value="Nature/Leisure">Nature/Leisure</option>
            <option value="Wildlife/Safari">Wildlife/Safari</option>
            <option value="Architecture/Adventure">
              Architecture/Adventure
            </option>
            <option value="Leisure/Urban">Leisure/Urban</option>
            <option value="Nature/Relaxation">Nature/Relaxation</option>
            <option value="Cultural/Adventure">Cultural/Adventure</option>
            <option value="Historical/Nature">Historical/Nature</option>
            <option value="Historical/Cultural">Historical/Cultural</option>
            <option value="Leisure/Resort">Leisure/Resort</option>
          </select>
        </div>
      ),
    },
    // Step 3: Activities
    {
      title: "What activities are you interested in?",
      component: (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Activity Type
          </label>
          <select
            name="activity_type"
            value={formData.activity_type}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select activity type</option>
            <option value="Hiking">Hiking</option>
            <option value="Swimming">Swimming</option>
            <option value="Safari">Safari</option>
            <option value="Picnic">Picnic</option>
            <option value="Tour">Cultural/Historical Tours</option>
            <option value="Relaxation">Relaxation/Spa</option>
            <option value="Shopping">Shopping</option>
            <option value="Boating">Boating/Water Activities</option>
            <option value="Photography">Photography</option>
            <option value="Horse Riding">Horse Riding</option>
          </select>
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

        <div className="flex justify-between">
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
