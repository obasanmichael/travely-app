import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

type BrandLogoProps = {
  /** Use on dark/image backgrounds */
  variant?: "default" | "light";
  showBackHint?: boolean;
  className?: string;
};

export function BrandLogo({
  variant = "default",
  showBackHint = false,
  className = "",
}: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      to="/"
      className={`group inline-flex flex-col gap-1 rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-travel-500 focus-visible:ring-offset-2 ${isLight ? "focus-visible:ring-offset-transparent" : ""} ${className}`}
      aria-label="Travely — return to home"
    >
      <span className="inline-flex items-center gap-2">
        <MapPin
          className={`h-7 w-7 shrink-0 ${isLight ? "text-travel-300" : "text-travel-600"}`}
          aria-hidden
        />
        <span
          className={`text-2xl font-bold tracking-tight ${isLight ? "text-white" : "text-primary"}`}
        >
          Travely
        </span>
      </span>
      {showBackHint && (
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
            isLight
              ? "text-white/75 group-hover:text-white"
              : "text-muted group-hover:text-travel-600 dark:group-hover:text-travel-400"
          }`}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to home
        </span>
      )}
    </Link>
  );
}
