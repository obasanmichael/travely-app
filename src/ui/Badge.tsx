import type { HTMLAttributes } from "react";
import { cn } from "./cn";

type Tone = "neutral" | "primary" | "sun" | "danger";
const TONE: Record<Tone, string> = {
  neutral: "bg-line text-ink",
  primary: "bg-primary-wash text-primary",
  sun: "bg-sun text-night",
  danger: "bg-danger-wash text-danger",
};

export function Badge({ tone = "neutral", className, ...rest }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", TONE[tone], className)} {...rest} />
  );
}
