import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { THEME_KEY, readChoice, resolve } from "./theme";

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("resolves system against the OS preference", () => {
    expect(resolve("system", true)).toBe("dark");
    expect(resolve("system", false)).toBe("light");
    expect(resolve("light", true)).toBe("light");
  });

  it("falls back to system for missing or tampered storage", () => {
    expect(readChoice()).toBe("system");
    localStorage.setItem(THEME_KEY, "neon");
    expect(readChoice()).toBe("system");
  });

  it("cycles, applies the dark class and persists the choice", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Switch to Light/ }));
    await user.click(screen.getByRole("button", { name: /Switch to Dark/ }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });
});
