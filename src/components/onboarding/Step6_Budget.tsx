import React from "react";
import QuestionWrapper from "./QuestionWrapper";
import { Info } from "lucide-react"; // using lucide-react icons

interface Props {
  value: string;
  onChange: (val: string) => void;
  step: number;
  totalSteps: number;
}

const Step6_Budget: React.FC<Props> = ({
  value,
  onChange,
  step,
  totalSteps,
}) => {
  const options = [
    "$500 – $999",
    "$1,000 – $1,999",
    "$2,000 – $2,999",
    "$3,000 – $4,999",
    "$5,000+",
  ];

  return (
    <QuestionWrapper
      step={step}
      totalSteps={totalSteps}
      title="What is your estimated budget per person (USD)?"
    >
      <div className="flex items-center justify-center text-sm text-gray-500 mb-3 relative">
        <p>
          This should cover travel, lodging, food, tourism, and other expenses.
        </p>
        <div className="relative group ml-2 cursor-pointer">
          <Info size={16} className="text-gray-400" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-56 p-2 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            The budget is calculated per person and includes travel,
            accommodation, food, activities, and more.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
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

export default Step6_Budget;
