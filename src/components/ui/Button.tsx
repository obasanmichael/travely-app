import React from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-travel-600 text-white hover:bg-travel-700 dark:bg-travel-500 dark:hover:bg-travel-400 shadow-sm",
  secondary:
    "bg-surface-raised text-primary border border-default hover:bg-surface-muted shadow-sm",
  ghost:
    "text-secondary hover:bg-surface-muted hover:text-primary",
  danger:
    "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-sm rounded-xl",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-travel-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) => (
  <button
    className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface ButtonLinkProps {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  to,
  variant = "primary",
  size = "md",
  className = "",
  children,
}) => (
  <Link
    to={to}
    className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
  >
    {children}
  </Link>
);
