import React from "react";
import QuestionWrapper from "./QuestionWrapper";

interface Props {
  value: string;
  onChange: (val: string) => void;
  step: number;
  totalSteps: number;
}

const Step8_ClimatePreference: React.FC<Props> = ({
  value,
  onChange,
  step,
  totalSteps,
}) => {
  const options = [
    "Warm & Sunny",
    "Cool & Breezy",
    "Cold & Snowy",
    "No Preference",
  ];

  return (
    <QuestionWrapper
      step={step}
      totalSteps={totalSteps}
      title="What’s your preferred climate for this trip?"
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

export default Step8_ClimatePreference;
