import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "./cn";

export function Select({ label, className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        className={cn(
          "h-11 w-full appearance-none rounded-xl border border-line bg-surface pl-4 pr-10 text-[15px] text-ink transition-colors",
          "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
          className
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
    </label>
  );
}
