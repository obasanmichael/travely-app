import React from "react";
import { ThemeProvider } from "../../context/ThemeContext";

/** Scopes light/dark theme to dashboard routes only */
export const DashboardThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <ThemeProvider active>{children}</ThemeProvider>
);
