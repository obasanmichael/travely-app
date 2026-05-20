import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ThemeToggleProps {
  collapsed?: boolean;
  compact?: boolean;
  /** For navbars over dark hero imagery */
  overlay?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  collapsed,
  compact,
  overlay,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const overlayClass =
    "inline-flex items-center justify-center p-2 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors";
  const compactClass =
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-default bg-surface-raised text-sm font-medium text-secondary hover:bg-surface-muted hover:text-primary transition-colors";
  const iconOnlyClass =
    "inline-flex items-center justify-center p-2 rounded-lg border border-default bg-surface-raised text-secondary hover:bg-surface-muted hover:text-primary transition-colors";

  if (overlay) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={overlayClass}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-sunset-400" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={compactClass}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-sunset-500" />
            Light
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-travel-600" />
            Dark
          </>
        )}
      </button>
    );
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Light mode" : "Dark mode"}
        className={iconOnlyClass}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-sunset-500" />
        ) : (
          <Moon className="w-5 h-5 text-travel-600" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="flex items-center gap-3 w-full p-3 rounded-xl text-secondary hover:bg-surface-muted hover:text-primary transition-colors"
    >
      {isDark ? (
        <Sun className="w-5 h-5 shrink-0 text-sunset-500" />
      ) : (
        <Moon className="w-5 h-5 shrink-0 text-travel-600" />
      )}
      <span className="text-sm font-medium">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
};
