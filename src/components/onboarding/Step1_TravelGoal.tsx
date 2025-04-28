// src/components/onboarding/Step1_TravelGoal.tsx
import React from "react";
import QuestionWrapper from "./QuestionWrapper";

interface Props {
  value: string | number | string[];
  onChange: (val: string | number | string[]) => void;
  step: number;
  totalSteps: number;
}


const Step1_TravelGoal: React.FC<Props> = ({
  value,
  onChange,
  step,
  totalSteps,
}) => {
  const options = [
    "Relaxation",
    "Adventure",
    "Cultural Exploration",
    "Romantic",
    "Family Time",
  ];

  return (
    <QuestionWrapper
      step={step}
      totalSteps={totalSteps}
      title="What is your primary travel goal?"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 py-2 rounded-xl border transition ${
              value === option
                ? "bg-blue-600 text-white"
                : "bg-white border-gray-300 hover:bg-blue-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </QuestionWrapper>
  );
};

export default Step1_TravelGoal;
