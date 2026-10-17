import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "./cn";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string | null;
  trailing?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, trailing, className, id, ...rest },
  ref
) {
  const auto = useId();
  const inputId = id ?? auto;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            "h-12 w-full rounded-xl border bg-surface px-4 text-base text-ink placeholder:text-muted/70 transition-colors",
            "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
            error ? "border-danger" : "border-line",
            trailing ? "pr-12" : "",
            className
          )}
          {...rest}
        />
        {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="m-0 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="m-0 text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
