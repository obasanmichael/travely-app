import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/client";
import { META, response } from "../../test/fixtures";
import { ResultsPage } from "./ResultsPage";

const api = vi.hoisted(() => ({ getMeta: vi.fn(), getRecommendations: vi.fn() }));
vi.mock("../../api/client", async (original) => ({
  ...(await original<typeof import("../../api/client")>()),
  getMeta: api.getMeta,
  getRecommendations: api.getRecommendations,
}));

function renderAt(url: string) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </MemoryRouter>
  );
}

const URL = "/results?from=NG-LA&budget=150000&days=3&people=2&tier=mid&pace=balanced&month=8&k=abcdefgh12";

describe("ResultsPage", () => {
  beforeEach(() => {
    api.getMeta.mockResolvedValue(META);
    api.getRecommendations.mockReset();
  });

  it("shows picks with reasons, sends the request key and summarises the search", async () => {
    api.getRecommendations.mockResolvedValue(response());
    renderAt(URL);

    expect(await screen.findByRole("heading", { name: "Erin-Ijesha Waterfalls" })).toBeInTheDocument();
    expect(screen.getByText("Matches your interest in waterfalls")).toBeInTheDocument();
    expect(await screen.findByText("₦150,000 for 3 days from Lagos, 2 people in August")).toBeInTheDocument();
    expect(api.getRecommendations).toHaveBeenCalledWith(
      expect.objectContaining({ origin_state: "NG-LA", budget: 150_000, month: 8 }),
      "abcdefgh12"
    );
  });

  it("guides the user when nothing fits", async () => {
    api.getRecommendations.mockResolvedValue(response({ recommendations: [], cheapest_feasible_budget: 210_000 }));
    renderAt(URL);
    expect(await screen.findByText(/starts around ₦210,000/)).toBeInTheDocument();
  });

  it("discloses relaxed constraints", async () => {
    api.getRecommendations.mockResolvedValue(response({ relaxed: ["budget"] }));
    renderAt(URL);
    expect(await screen.findByText(/may cost up to 35% more/)).toBeInTheDocument();
  });

  it("says what failed and retries", async () => {
    api.getRecommendations
      .mockRejectedValueOnce(new ApiError("Can't reach Travely. Check your connection and try again.", 0, true))
      .mockResolvedValueOnce(response());
    renderAt(URL);

    expect(await screen.findByRole("alert")).toHaveTextContent("Can't reach Travely");
    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("heading", { name: "Erin-Ijesha Waterfalls" })).toBeInTheDocument();
  });

  it("expands the cost breakdown with its sources", async () => {
    api.getRecommendations.mockResolvedValue(response());
    renderAt(URL);
    await userEvent.setup().click(await screen.findByRole("button", { name: "How we estimated this" }));
    expect(screen.getByText(/NBS zonal food prices/)).toBeInTheDocument();
  });
});
