import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExplorePage } from "../features/explore/ExplorePage";
import { PlacePage } from "../features/places/PlacePage";
import { SavedPage } from "../features/saved/SavedPage";
import { TripsPage } from "../features/trips/TripsPage";
import { makeAuth, makeSaved } from "../test/factories";
import { ITEM, META } from "../test/fixtures";
import { Providers } from "../test/providers";
import { ThemeProvider } from "../theme/ThemeProvider";
import { OverviewPage } from "./OverviewPage";

const api = vi.hoisted(() => ({
  getMeta: vi.fn(), browseDestinations: vi.fn(), getRuns: vi.fn(), getSaved: vi.fn(), getDestination: vi.fn(),
}));
vi.mock("../api/client", async (original) => ({ ...(await original<typeof import("../api/client")>()), ...api }));

const PLACE = ITEM.destination;
const USER = { uid: "u1", email: "ada@example.com", displayName: "Ada Obi", isAnonymous: false } as never;

function renderAt(url: string, element: React.ReactNode, path: string, options: { signedIn?: boolean; saved?: ReturnType<typeof makeSaved> } = {}) {
  const { signedIn = true, saved = makeSaved() } = options;
  render(
    <ThemeProvider>
      <Providers auth={makeAuth({ user: signedIn ? USER : null, isSignedIn: signedIn })} saved={saved}>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path={path} element={element} />
          </Routes>
        </MemoryRouter>
      </Providers>
    </ThemeProvider>
  );
}

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset());
  api.getMeta.mockResolvedValue(META);
  api.browseDestinations.mockResolvedValue({ items: [PLACE], total: 1, page: 1, page_size: 24 });
});

describe("ExplorePage", () => {
  it("lists places and filters by state and month", async () => {
    renderAt("/app/explore", <ExplorePage />, "/app/explore");
    expect(await screen.findByText("Erin-Ijesha Waterfalls")).toBeInTheDocument();
    expect(screen.getByText("1 place")).toBeInTheDocument();
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("State"), "NG-OS");
    await waitFor(() => expect(api.browseDestinations).toHaveBeenLastCalledWith(expect.objectContaining({ state: "NG-OS" })));
    await user.selectOptions(screen.getByLabelText("Great in"), "12");
    await waitFor(() => expect(api.browseDestinations).toHaveBeenLastCalledWith(expect.objectContaining({ state: "NG-OS", month: 12 })));
  });

  it("says nothing matched and offers to clear filters", async () => {
    api.browseDestinations.mockResolvedValue({ items: [], total: 0, page: 1, page_size: 24 });
    renderAt("/app/explore?state=NG-OS", <ExplorePage />, "/app/explore");
    expect(await screen.findByText("No places match")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });

  it("offers more when the catalog has more than one page", async () => {
    api.browseDestinations.mockResolvedValue({ items: [PLACE], total: 30, page: 1, page_size: 24 });
    renderAt("/app/explore", <ExplorePage />, "/app/explore");
    await userEvent.setup().click(await screen.findByRole("button", { name: "Show more places" }));
    await waitFor(() => expect(api.browseDestinations).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })));
  });
});

describe("SavedPage", () => {
  it("shows an invitation when nothing is saved", async () => {
    api.getSaved.mockResolvedValue([]);
    renderAt("/app/saved", <SavedPage />, "/app/saved");
    expect(await screen.findByText("Nothing saved yet")).toBeInTheDocument();
  });

  it("lists saved places, and hides ones that have been unsaved", async () => {
    api.getSaved.mockResolvedValue([PLACE]);
    renderAt("/app/saved", <SavedPage />, "/app/saved", { saved: makeSaved({ ids: new Set([PLACE.id]) }) });
    expect(await screen.findByText("Erin-Ijesha Waterfalls")).toBeInTheDocument();
  });

  it("doesn't show a place that is no longer in the saved set", async () => {
    api.getSaved.mockResolvedValue([PLACE]);
    renderAt("/app/saved", <SavedPage />, "/app/saved", { saved: makeSaved({ ids: new Set() }) });
    expect(await screen.findByText("Nothing saved yet")).toBeInTheDocument();
    expect(screen.queryByText("Erin-Ijesha Waterfalls")).not.toBeInTheDocument();
  });

  it("nudges guests to create an account", async () => {
    api.getSaved.mockResolvedValue([]);
    renderAt("/app/saved", <SavedPage />, "/app/saved", { signedIn: false });
    expect(await screen.findByRole("link", { name: "Create an account" })).toHaveAttribute("href", "/signup?next=/app/saved");
  });
});

describe("TripsPage", () => {
  it("lists trips with links to reopen them", async () => {
    api.getRuns.mockResolvedValue([
      { id: "r1", created_at: "2026-10-17T10:00:00Z", inputs: { budget: 150000, days: 3, travellers: 2, month: 12 }, top_places: ["Erin-Ijesha Waterfalls"] },
    ]);
    renderAt("/app/trips", <TripsPage />, "/app/trips");
    const link = await screen.findByRole("link", { name: /₦150,000, 3 days, 2 people, December/ });
    expect(link).toHaveAttribute("href", "/app/trips/r1");
    expect(link).toHaveTextContent("Top picks: Erin-Ijesha Waterfalls");
  });

  it("invites the first trip when there are none", async () => {
    api.getRuns.mockResolvedValue([]);
    renderAt("/app/trips", <TripsPage />, "/app/trips");
    expect(await screen.findByText("No trips yet")).toBeInTheDocument();
  });
});

describe("OverviewPage", () => {
  it("invites a first trip and shows places that are great this month", async () => {
    api.getRuns.mockResolvedValue([]);
    api.getSaved.mockResolvedValue([]);
    renderAt("/app", <OverviewPage />, "/app");
    expect(await screen.findByText("Let's plan your first trip")).toBeInTheDocument();
    expect(await screen.findByText("Erin-Ijesha Waterfalls")).toBeInTheDocument();
    expect(screen.getByText(/^Good (morning|afternoon|evening), Ada$/)).toBeInTheDocument();
  });

  it("reopens the latest trip and previews saved places", async () => {
    api.getRuns.mockResolvedValue([{ id: "r9", created_at: "2026-10-17T10:00:00Z", inputs: { budget: 80000, days: 1, travellers: 1 }, top_places: ["Lekki"] }]);
    api.getSaved.mockResolvedValue([PLACE]);
    renderAt("/app", <OverviewPage />, "/app");
    expect(await screen.findByRole("link", { name: /Open trip/ })).toHaveAttribute("href", "/app/trips/r9");
    expect(await screen.findAllByText("Erin-Ijesha Waterfalls")).not.toHaveLength(0);
  });

  it("doesn't call the signed-in APIs for a guest with no session", async () => {
    renderAt("/app", <OverviewPage />, "/app", { signedIn: false });
    expect(await screen.findByText("Let's plan your first trip")).toBeInTheDocument();
    expect(api.getRuns).not.toHaveBeenCalled();
    expect(api.getSaved).not.toHaveBeenCalled();
  });
});

describe("PlacePage", () => {
  it("shows a place with its season and a way to plan", async () => {
    api.getDestination.mockResolvedValue(PLACE);
    renderAt("/app/places/erin-ijesha-waterfalls", <PlacePage />, "/app/places/:slug");
    expect(await screen.findByRole("heading", { name: "Erin-Ijesha Waterfalls" })).toBeInTheDocument();
    expect(screen.getByText("Best months:")).toBeInTheDocument();
  });

  it("explains an unknown place", async () => {
    const { ApiError } = await import("../api/client");
    api.getDestination.mockRejectedValueOnce(new ApiError("x", 404, false));
    renderAt("/app/places/nowhere", <PlacePage />, "/app/places/:slug");
    expect(await screen.findByText("We couldn't find that place")).toBeInTheDocument();
  });
});
