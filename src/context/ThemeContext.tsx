import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "travely-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const DASHBOARD_PATH_PREFIXES = [
  "/recommendations",
  "/survey",
  "/explore",
  "/settings",
] as const;

export function isDashboardPath(pathname: string): boolean {
  return DASHBOARD_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function applyTheme(theme: Theme, active: boolean) {
  const root = document.documentElement;
  if (!active) {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    return;
  }
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  active?: boolean;
}> = ({ children, active = true }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme, active);
    if (active) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, active]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
