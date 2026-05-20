import React from "react";

type BadgeVariant = "default" | "accent" | "success" | "warning";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-muted text-secondary",
  accent: "bg-accent-soft text-travel-700 dark:text-travel-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
  >
    {children}
  </span>
);
