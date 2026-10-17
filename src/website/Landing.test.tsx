import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ITEM } from "../test/fixtures";
import { Providers } from "../test/providers";
import { ThemeProvider } from "../theme/ThemeProvider";
import { Landing } from "./Landing";

const api = vi.hoisted(() => ({ getFeatured: vi.fn(), getSample: vi.fn() }));
vi.mock("../api/client", async (original) => ({
  ...(await original<typeof import("../api/client")>()),
  getFeatured: api.getFeatured,
  getSample: api.getSample,
}));

function renderLanding() {
  render(
    <ThemeProvider>
      <Providers>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </Providers>
    </ThemeProvider>
  );
}

describe("Landing", () => {
  beforeEach(() => {
    api.getFeatured.mockResolvedValue([ITEM.destination, { ...ITEM.destination, id: "d2", slug: "x", name: "Second Place" }]);
    api.getSample.mockResolvedValue({
      origin: "Lagos",
      days: 1,
      travellers: 2,
      budget: 150_000,
      month: 12,
      pick: ITEM,
      places: 475,
      states: 37,
    });
  });

  it("leads with the promise and sends people to plan a trip", async () => {
    renderLanding();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Trips that fit your budget and your taste.");
    const cta = screen.getAllByRole("link", { name: /Plan my trip/ });
    expect(cta.length).toBeGreaterThan(0);
    expect(cta[0]).toHaveAttribute("href", "/app/plan");
  });

  it("shows the real example trip with its numbers", async () => {
    renderLanding();
    expect(await screen.findByRole("complementary", { name: "Example trip" })).toBeInTheDocument();
    expect(screen.getByText("₦45k–₦77k")).toBeInTheDocument();
  });

  it("still reads fine when the example can't load", async () => {
    api.getSample.mockRejectedValue(new Error("down"));
    api.getFeatured.mockRejectedValue(new Error("down"));
    renderLanding();
    expect(screen.getByText("Three steps from a budget to a plan.")).toBeInTheDocument();
    expect(screen.queryByRole("complementary", { name: "Example trip" })).not.toBeInTheDocument();
  });

  it("answers the pricing question in the FAQ", async () => {
    renderLanding();
    expect(screen.getByRole("button", { name: "Where do the prices come from?" })).toBeInTheDocument();
  });
});
