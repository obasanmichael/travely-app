import React from "react";
import QuestionWrapper from "./QuestionWrapper";

interface Props {
  value: string;
  onChange: (val: string) => void;
  step: number;
  totalSteps: number;
}

const Step3_DestinationType: React.FC<Props> = ({
  value,
  onChange,
  step,
  totalSteps,
}) => {
  const options = [
    "Beach",
    "Mountain",
    "City",
    "Countryside",
    "Historical Sites",
    "Island",
    "Desert",
    "Lakeside",
  ];

  return (
    <QuestionWrapper
      step={step}
      totalSteps={totalSteps}
      title="What type of destination do you prefer?"
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

export default Step3_DestinationType;
