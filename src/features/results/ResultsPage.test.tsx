import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/client";
import { ITEM, META, response } from "../../test/fixtures";
import { makeSaved } from "../../test/factories";
import { Providers } from "../../test/providers";
import { fromParams } from "../search/searchState";
import { nothingFitsReason } from "./messages";
import { ResultsPage } from "./ResultsPage";

const api = vi.hoisted(() => ({ getMeta: vi.fn(), getRecommendations: vi.fn() }));
vi.mock("../../api/client", async (original) => ({
  ...(await original<typeof import("../../api/client")>()),
  getMeta: api.getMeta,
  getRecommendations: api.getRecommendations,
}));

function renderAt(url: string, saved = makeSaved()) {
  render(
    <Providers saved={saved}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/app/results" element={<ResultsPage />} />
        </Routes>
      </MemoryRouter>
    </Providers>
  );
}

const URL = "/app/results?from=NG-LA&budget=150000&days=3&people=2&tier=mid&pace=balanced&month=8&k=abcdefgh12";

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
    expect(screen.getByRole("heading", { name: "1 place fits" })).toBeInTheDocument();
    expect(screen.getByText("₦150,000 total")).toBeInTheDocument();
    expect(await screen.findByText("Lagos")).toBeInTheDocument();
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

  it("offers day trips when overnight stays can't be priced yet", async () => {
    api.getRecommendations.mockResolvedValue(response({ recommendations: [], cheapest_feasible_budget: null }));
    renderAt(URL);
    expect(await screen.findByText(/overnight trips can't be planned right now/)).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "See day trips instead" }));
    expect(api.getRecommendations).toHaveBeenLastCalledWith(expect.objectContaining({ days: 1 }), expect.any(String));
  });

  it("shows partly priced places separately and says what's missing", async () => {
    const partial = {
      ...ITEM,
      cost: { ...ITEM.cost, missing: ["accommodation"] },
      reasons: [{ kind: "cost", text: "Travel and food come to ₦45,000–₦77,000; places-to-stay prices aren't verified yet" }],
    };
    api.getRecommendations.mockResolvedValue(response({ recommendations: [], unverified_stays: [partial] }));
    renderAt(URL);
    expect(await screen.findByRole("heading", { name: "Places that could work" })).toBeInTheDocument();
    expect(screen.getByText("Plus a place to stay. Its price isn't verified yet.")).toBeInTheDocument();
    expect(screen.queryByText("Best match")).not.toBeInTheDocument();
  });

  it("saves a place", async () => {
    const saved = makeSaved();
    api.getRecommendations.mockResolvedValue(response());
    renderAt(URL, saved);
    await userEvent.setup().click(await screen.findByRole("button", { name: "Save Erin-Ijesha Waterfalls" }));
    expect(saved.toggle).toHaveBeenCalledWith("d1");
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


describe("nothingFitsReason", () => {
  const search = { ...fromParams(new URLSearchParams("budget=120000&days=13&people=2")).state };

  it("blames the budget when travel and food alone exceed it", () => {
    expect(nothingFitsReason({ cheapest_feasible_budget: null, cheapest_without_stay: 330_000 }, search)).toMatch(
      /at least ₦330,000/
    );
  });

  it("blames missing stay prices only when they're the real gap", () => {
    expect(nothingFitsReason({ cheapest_feasible_budget: null, cheapest_without_stay: 60_000 }, search)).toMatch(
      /haven't verified prices for places to stay/
    );
  });
});
