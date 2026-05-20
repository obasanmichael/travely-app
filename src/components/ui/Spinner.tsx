import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-5 w-5 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-14 w-14 border-4",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
}) => (
  <div
    role="status"
    aria-label="Loading"
    className={`animate-spin rounded-full border-travel-200 border-t-travel-600 dark:border-travel-800 dark:border-t-travel-400 ${sizeClasses[size]} ${className}`}
  />
);
