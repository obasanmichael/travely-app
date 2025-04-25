import React from "react";
import QuestionWrapper from "./QuestionWrapper";

interface Props {
  value: string[];
  onChange: (val: string[]) => void;
  step: number;
  totalSteps: number;
}

const Step2_Activities: React.FC<Props> = ({
  value,
  onChange,
  step,
  totalSteps,
}) => {
  const options = [
    "Adventure (e.g., hiking, zip-lining, etc.)",
    "Cultural Exploration (e.g., museums, historic sites, etc.)",
    "Relaxation (e.g., beaches, spas, etc.)",
    "Nature (e.g., safaris, gardens, etc.)",
    "Food & Drink (e.g., culinary tours, local cuisine, etc.)",
    "Shopping",
    "Nightlife (e.g., clubs, events, etc.)",
    "Wellness (e.g., yoga, meditation, etc.)",
  ];

  const handleSelection = (option: string) => {
    const newSelection = value.includes(option)
      ? value.filter((activity) => activity !== option)
      : [...value, option];
    onChange(newSelection);
  };

  return (
    <QuestionWrapper
      step={step}
      totalSteps={totalSteps}
      title="What activities interest you?"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelection(option)}
            className={`px-4 py-2 rounded-xl border transition ${
              value.includes(option)
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

export default Step2_Activities;
