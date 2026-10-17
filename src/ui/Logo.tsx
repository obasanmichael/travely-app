import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "./cn";

interface LogoProps {
  /** Where the logo links to. */
  to?: string;
  /** Show just the pin, for tight spaces like a collapsed sidebar. */
  markOnly?: boolean;
  /** Use white lettering on dark photos and bars. */
  tone?: "auto" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const MARK: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "h-8 w-8 rounded-xl [&>svg]:h-[18px] [&>svg]:w-[18px]",
  md: "h-9 w-9 rounded-xl [&>svg]:h-5 [&>svg]:w-5",
  lg: "h-11 w-11 rounded-2xl [&>svg]:h-6 [&>svg]:w-6",
};
const WORD: Record<NonNullable<LogoProps["size"]>, string> = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" };

/** The Travely map pin and wordmark. */
export function Logo({ to = "/", markOnly = false, tone = "auto", size = "md", className }: LogoProps) {
  return (
    <Link to={to} aria-label="Travely home" className={cn("inline-flex items-center gap-2.5 no-underline", className)}>
      <span className={cn("grid shrink-0 place-items-center bg-primary text-white shadow-card", MARK[size])}>
        <MapPin strokeWidth={2.25} aria-hidden="true" />
      </span>
      {!markOnly && (
        <span className={cn("font-serif leading-none tracking-tight", WORD[size], tone === "light" ? "text-white" : "text-ink")}>travely</span>
      )}
    </Link>
  );
}
