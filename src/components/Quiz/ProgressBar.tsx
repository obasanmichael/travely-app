import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="w-full bg-surface-muted rounded-full h-2.5">
        <div
          className="bg-travel-600 dark:bg-travel-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-right mt-1 text-muted">
        Step {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
};

export default ProgressBar;
