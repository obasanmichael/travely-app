import { Link, type LinkProps } from "react-router-dom";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "sun" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-white shadow-card hover:bg-primary-strong",
  secondary: "border border-line bg-surface text-ink hover:border-ink/30 hover:bg-raised",
  ghost: "text-ink hover:bg-line",
  sun: "bg-sun text-night shadow-card hover:brightness-95",
  danger: "bg-danger text-white hover:brightness-95",
};
const SIZE: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold no-underline transition-all duration-200 " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { variant = "primary", size = "md", className, children, type = "button", ...rest },
  ref
) {
  return (
    <button ref={ref} type={type} className={cn(base, VARIANT[variant], SIZE[size], className)} {...rest}>
      {children}
    </button>
  );
});

export function ButtonLink({ variant = "primary", size = "md", className, children, ...rest }: Common & LinkProps) {
  return (
    <Link className={cn(base, VARIANT[variant], SIZE[size], className)} {...rest}>
      {children}
    </Link>
  );
}
