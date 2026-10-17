import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded-lg bg-[linear-gradient(90deg,var(--c-line)_25%,color-mix(in_srgb,var(--c-line)_40%,transparent)_50%,var(--c-line)_75%)] bg-[length:200%_100%]",
        className
      )}
      {...rest}
    />
  );
}
