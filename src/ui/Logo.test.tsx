import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

const show = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Logo", () => {
  it("shows the pin and the wordmark, linking home", () => {
    show(<Logo />);
    const link = screen.getByRole("link", { name: "Travely home" });
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveTextContent("travely");
    expect(link.querySelector("svg")).not.toBeNull();
  });

  it("keeps only the pin when collapsed, and is still named for screen readers", () => {
    show(<Logo to="/app" markOnly />);
    const link = screen.getByRole("link", { name: "Travely home" });
    expect(link).toHaveAttribute("href", "/app");
    expect(link).not.toHaveTextContent("travely");
    expect(link.querySelector("svg")).not.toBeNull();
  });
});
