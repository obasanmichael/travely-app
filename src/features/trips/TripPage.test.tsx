import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/client";
import { makeSaved } from "../../test/factories";
import { ITEM, response } from "../../test/fixtures";
import { Providers } from "../../test/providers";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { TripPage } from "./TripPage";

const api = vi.hoisted(() => ({ getTrip: vi.fn() }));
vi.mock("../../api/client", async (original) => ({ ...(await original<typeof import("../../api/client")>()), getTrip: api.getTrip }));

const INPUTS = { origin_state: "NG-LA", budget: 150_000, days: 3, travellers: 2, month: 12, tier: "mid", interests: { waterfalls: "love" }, pace: "balanced", with_children: false };

function Plan() {
  const location = useLocation();
  const state = location.state as { prefill: { days: number; budget: number }; step: number };
  return <p>Plan page days={state.prefill.days} step={state.step}</p>;
}

function renderTrip(saved = makeSaved()) {
  render(
    <ThemeProvider>
      <Providers saved={saved}>
        <MemoryRouter initialEntries={["/app/trips/run-1"]}>
          <Routes>
            <Route path="/app/trips/:runId" element={<TripPage />} />
            <Route path="/app/plan" element={<Plan />} />
          </Routes>
        </MemoryRouter>
      </Providers>
    </ThemeProvider>
  );
}

function trip(outputs = response()) {
  return { id: "run-1", created_at: "2026-10-17T10:00:00Z", inputs: INPUTS, outputs };
}

describe("TripPage", () => {
  beforeEach(() => api.getTrip.mockReset());

  it("opens a stored trip with its summary and cards", async () => {
    api.getTrip.mockResolvedValue(trip());
    renderTrip();
    expect(await screen.findByRole("heading", { name: "₦150,000 for 3 days" })).toBeInTheDocument();
    expect(screen.getByText(/2 people, December/)).toBeInTheDocument();
    expect(screen.getByText("Best match")).toBeInTheDocument();
    expect(screen.getByText("Matches your interest in waterfalls")).toBeInTheDocument();
  });

  it("opens a detail drawer with the sourced cost breakdown", async () => {
    api.getTrip.mockResolvedValue(trip());
    renderTrip();
    await userEvent.setup().click(await screen.findByRole("button", { name: "View details for Erin-Ijesha Waterfalls" }));
    const drawer = await screen.findByRole("dialog");
    expect(drawer).toHaveTextContent("Why it fits");
    expect(drawer).toHaveTextContent("NBS zonal food prices");
    expect(drawer).toHaveTextContent("medium confidence");
  });

  it("saves a place from its card", async () => {
    const saved = makeSaved();
    api.getTrip.mockResolvedValue(trip());
    renderTrip(saved);
    await userEvent.setup().click(await screen.findByRole("button", { name: "Save Erin-Ijesha Waterfalls" }));
    expect(saved.toggle).toHaveBeenCalledWith("d1");
  });

  it("separates partly priced places and says what's missing", async () => {
    const partial = { ...ITEM, cost: { ...ITEM.cost, missing: ["accommodation"] } };
    api.getTrip.mockResolvedValue(trip(response({ recommendations: [], unverified_stays: [partial] })));
    renderTrip();
    expect(await screen.findByRole("tab", { name: "Could work (1)" })).toBeInTheDocument();
    expect(screen.queryByText("Best match")).not.toBeInTheDocument();
    expect(screen.getByText("Plus a place to stay. Its price isn't verified yet.")).toBeInTheDocument();
  });

  it("explains nothing fitting and offers day trips in the quiz", async () => {
    api.getTrip.mockResolvedValue(trip(response({ recommendations: [], cheapest_feasible_budget: 210_000 })));
    renderTrip();
    expect(await screen.findByText(/starts around ₦210,000/)).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "See day trips instead" }));
    expect(await screen.findByText("Plan page days=1 step=8")).toBeInTheDocument();
  });

  it("discloses relaxed constraints", async () => {
    api.getTrip.mockResolvedValue(trip(response({ relaxed: ["budget"] })));
    renderTrip();
    expect(await screen.findByText(/may cost up to 35% more/)).toBeInTheDocument();
  });

  it("says what failed, and not-found trips get their own explanation", async () => {
    api.getTrip.mockRejectedValueOnce(new ApiError("We couldn't find that trip", 404, false));
    renderTrip();
    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't find that trip");
    expect(screen.getByRole("link", { name: "Plan a new trip" })).toBeInTheDocument();
  });

  it("lets the user edit a trip from where it started", async () => {
    api.getTrip.mockResolvedValue(trip());
    renderTrip();
    await userEvent.setup().click(await screen.findByRole("button", { name: /Edit trip/ }));
    expect(await screen.findByText("Plan page days=3 step=0")).toBeInTheDocument();
  });
});
