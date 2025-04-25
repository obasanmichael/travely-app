// src/components/onboarding/QuestionWrapper.tsx
import React from "react";

type Props = {
  title: string;
  step?: number;
    totalSteps?: number;
    question?: string;
  children: React.ReactNode;
};

const QuestionWrapper: React.FC<Props> = ({
  title,
  step,
  totalSteps,
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {step !== undefined && totalSteps !== undefined && (
        <div className="text-sm text-gray-500 mb-2">
          Step {step} of {totalSteps}
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default QuestionWrapper;
