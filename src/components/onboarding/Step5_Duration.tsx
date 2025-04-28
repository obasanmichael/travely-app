import React from "react";
import QuestionWrapper from "./QuestionWrapper";

interface Props {
  value: string;
  onChange: (val: string) => void;
  step: number;
  totalSteps: number;
}

const Step5_Duration: React.FC<Props> = ({
  value,
  onChange,
  step,
  totalSteps,
}) => {
  const options = [
    "Weekend (1-3 days)",
    "Short Stay (4-6 days)",
    "1 Week",
    "2 Weeks",
    "3+ Weeks",
  ];

  return (
    <QuestionWrapper
      step={step}
      totalSteps={totalSteps}
      title="How long do you plan to travel?"
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

export default Step5_Duration;
