import { useEffect, useMemo, useState, type ReactNode } from "react";
import { THEME_KEY, readChoice, resolve } from "./theme";
import { ThemeContext, type ThemeChoice, type ThemeValue } from "./themeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(readChoice);
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolved = resolve(choice, systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [resolved]);

  const value = useMemo<ThemeValue>(
    () => ({
      choice,
      resolved,
      setChoice: (next) => {
        setChoiceState(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
          // Private mode: the choice still applies for this session.
        }
      },
    }),
    [choice, resolved]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
