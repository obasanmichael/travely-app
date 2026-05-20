import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => (
  <div
    className={`bg-surface-raised border border-default rounded-2xl shadow-card ${paddingClasses[padding]} ${className}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  action,
}) => (
  <div className="flex items-start justify-between gap-4 mb-5">
    <div>
      <h2 className="text-lg font-semibold text-primary tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-secondary mt-0.5">{description}</p>
      )}
    </div>
    {action}
  </div>
);
