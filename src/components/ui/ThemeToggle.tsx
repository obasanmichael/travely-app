import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ThemeToggleProps {
  collapsed?: boolean;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  collapsed,
  compact,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-default bg-surface-raised text-sm font-medium text-secondary hover:bg-surface-muted hover:text-primary transition-colors"
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

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`flex items-center gap-3 w-full p-3 rounded-xl text-secondary hover:bg-surface-muted hover:text-primary transition-colors ${
        collapsed ? "justify-center" : ""
      }`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 shrink-0 text-sunset-500" />
      ) : (
        <Moon className="w-5 h-5 shrink-0 text-travel-600" />
      )}
      {!collapsed && (
        <span className="text-sm font-medium">
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      )}
    </button>
  );
};
