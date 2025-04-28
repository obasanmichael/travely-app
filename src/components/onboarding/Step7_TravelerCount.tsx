import React from "react";
import QuestionWrapper from "./QuestionWrapper";

interface Props {
  value: number;
  onChange: (val: number) => void;
  step: number;
  totalSteps: number;
}

const Step7_TravelerCount: React.FC<Props> = ({
  value,
  onChange,
  step,
  totalSteps,
}) => {
  const options = [1, 2, 3, 4, 5];

  return (
    <QuestionWrapper
      step={step}
      totalSteps={totalSteps}
      title="How many people are traveling?"
    >
      <div className="grid grid-cols-3 gap-3 mt-4">
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
        <input
          type="number"
          min={1}
          placeholder="Other"
          value={!options.includes(value) && value ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="col-span-3 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
        />
      </div>
    </QuestionWrapper>
  );
};

export default Step7_TravelerCount;
