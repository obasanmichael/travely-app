// src/components/OnboardingStep.tsx
import React from "react";

type Props = {
  title: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
};

const OnboardingStep: React.FC<Props> = ({
  title,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h2>
      <div className="grid gap-3">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-200 ${
              value === option
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-50 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name={title}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="mr-3 accent-blue-600"
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default OnboardingStep;
