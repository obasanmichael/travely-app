import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { submitQuizAndGetRecommendations } from "../../services/recommendationService";
import ProgressBar from "./ProgressBar";
import { Button } from "../ui/Button";
import {
  quizInputClass,
  quizLabelClass,
  quizHintClass,
  quizBreakdownClass,
  quizBudgetSummaryClass,
} from "./quizStyles";

interface QuizFormData {
  budget: number;
  destination_type: string;
  activity_type: string;
}

const classifyBudget = (budget: number): string => {
  let lowScore = 0;
  if (budget <= 12000) {
    lowScore = 1;
  } else if (budget > 12000 && budget < 18000) {
    lowScore = (18000 - budget) / (18000 - 12000);
  }

  let mediumScore = 0;
  if (budget >= 15000 && budget <= 25000) {
    mediumScore = (budget - 15000) / (25000 - 15000);
  } else if (budget > 25000 && budget <= 35000) {
    mediumScore = (35000 - budget) / (35000 - 25000);
  }

  let highScore = 0;
  if (budget >= 32000 && budget <= 40000) {
    highScore = (budget - 32000) / (40000 - 32000);
  } else if (budget > 40000) {
    highScore = 1;
  }

  if (lowScore >= mediumScore && lowScore >= highScore) return "Low Budget";
  if (mediumScore >= lowScore && mediumScore >= highScore) return "Medium Budget";
  return "High Budget";
};

const getBudgetCategoryAccent = (category: string): string => {
  switch (category) {
    case "Low Budget":
      return "border-l-emerald-600 dark:border-l-emerald-400 text-emerald-700 dark:text-emerald-300";
    case "Medium Budget":
      return "border-l-travel-600 dark:border-l-travel-400 text-travel-700 dark:text-travel-300";
    case "High Budget":
      return "border-l-violet-600 dark:border-l-violet-400 text-violet-700 dark:text-violet-300";
    default:
      return "border-l-travel-600 dark:border-l-travel-400 text-secondary";
  }
};

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

const QuizForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState("");
  const [formData, setFormData] = useState<QuizFormData>({
    budget: 20000,
    destination_type: "",
    activity_type: "",
  });

  useEffect(() => {
    setBudgetCategory(classifyBudget(formData.budget));
  }, [formData.budget]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const processedValue = name === "budget" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const quizSteps = [
    {
      title: "What's your daily travel budget?",
      component: (
        <div className="mb-4">
          <label className={quizLabelClass}>Budget per day (₦)</label>

          <div className="mb-4">
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className={quizInputClass}
              min={5000}
              max={50000}
              step={1000}
              placeholder="Enter your budget"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>₦5,000</span>
              <span>₦25,000</span>
              <span>₦50,000</span>
            </div>
            <input
              type="range"
              min={5000}
              max={50000}
              step={1000}
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-travel-600"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>Budget</span>
              <span>Comfort</span>
              <span>Luxury</span>
            </div>
          </div>

          <div
            className={`${quizBudgetSummaryClass} ${getBudgetCategoryAccent(budgetCategory)}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-lg text-primary">
                  {budgetCategory}
                </h4>
                <p className="text-sm mt-1 font-medium">
                  ₦{formData.budget.toLocaleString()} per day
                </p>
              </div>
              <span className="text-2xl shrink-0" aria-hidden>
                {budgetCategory === "Low Budget" && "💰"}
                {budgetCategory === "Medium Budget" && "🏨"}
                {budgetCategory === "High Budget" && "✨"}
              </span>
            </div>
            <p className="text-sm mt-2 text-secondary leading-relaxed">
              {getBudgetExamples(budgetCategory)}
            </p>
          </div>

          <div className={quizBreakdownClass}>
            <h5 className="font-medium text-primary mb-3">
              Estimated daily breakdown
            </h5>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 rounded-lg bg-surface-raised border border-subtle">
                <div className="font-medium text-primary">Accommodation</div>
                <div className="text-secondary mt-1">
                  ₦{Math.round(formData.budget * 0.4).toLocaleString()}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-surface-raised border border-subtle">
                <div className="font-medium text-primary">Food</div>
                <div className="text-secondary mt-1">
                  ₦{Math.round(formData.budget * 0.3).toLocaleString()}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-surface-raised border border-subtle">
                <div className="font-medium text-primary">Activities</div>
                <div className="text-secondary mt-1">
                  ₦{Math.round(formData.budget * 0.3).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "What kind of destination are you looking for?",
      component: (
        <div className="mb-4">
          <label className={quizLabelClass}>Destination type</label>
          <select
            name="destination_type"
            value={formData.destination_type}
            onChange={handleChange}
            className={quizInputClass}
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

          {formData.destination_type && (
            <div className={quizHintClass}>
              <p>
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
    {
      title: "What activities are you most interested in?",
      component: (
        <div className="mb-4">
          <label className={quizLabelClass}>Activity type</label>
          <select
            name="activity_type"
            value={formData.activity_type}
            onChange={handleChange}
            className={quizInputClass}
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

          {formData.activity_type && (
            <div className={quizHintClass}>
              <p>
                Perfect! You&apos;ll enjoy destinations that offer{" "}
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
    if (currentStep === 1 && !formData.destination_type) {
      toast.error("Please select a destination type.");
      return;
    }
    if (currentStep < quizSteps.length - 1) {
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

    if (!formData.destination_type) {
      toast.error("Please select a destination type.");
      return;
    }
    if (!formData.activity_type) {
      toast.error("Please select an activity type.");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to submit the quiz.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitQuizAndGetRecommendations(user.uid, formData);
      await refreshUser();
      toast.success("Recommendations ready!");
      navigate("/recommendations");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Could not get recommendations. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 bg-surface-raised border border-default rounded-2xl shadow-card">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary tracking-tight">
        Travel Preference Quiz
      </h2>

      <ProgressBar currentStep={currentStep} totalSteps={quizSteps.length} />

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary">
            {quizSteps[currentStep].title}
          </h3>
          {quizSteps[currentStep].component}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            className="sm:min-w-[120px]"
          >
            Previous
          </Button>

          {currentStep < quizSteps.length - 1 ? (
            <Button
              type="button"
              onClick={goToNextStep}
              className="sm:min-w-[120px]"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !formData.destination_type ||
                !formData.activity_type
              }
              className="sm:min-w-[180px]"
            >
              {isSubmitting ? "Submitting..." : "Get recommendations"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
