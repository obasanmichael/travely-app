import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { NotFound } from "./NotFound";

describe("NotFound", () => {
  it("says what happened and offers a way back", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Lost the trail." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Open the app" })).toHaveAttribute("href", "/app");
  });
});
