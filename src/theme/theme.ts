import type { ThemeChoice } from "./themeContext";

export const THEME_KEY = "travely-theme";

export function readChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  } catch {
    return "system";
  }
}

export function resolve(choice: ThemeChoice, systemDark: boolean): "light" | "dark" {
  if (choice === "system") return systemDark ? "dark" : "light";
  return choice;
}
