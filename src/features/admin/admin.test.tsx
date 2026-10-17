import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/client";
import { makeAuth } from "../../test/factories";
import { META } from "../../test/fixtures";
import { Providers } from "../../test/providers";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { AdminGuard } from "./AdminGuard";
import { PricesPage } from "./PricesPage";
import { ReviewPage } from "./ReviewPage";

const api = vi.hoisted(() => ({
  getMeta: vi.fn(), adminList: vi.fn(), adminReview: vi.fn(), adminAddPrice: vi.fn(), adminCoverage: vi.fn(), adminPublish: vi.fn(),
}));
vi.mock("../../api/client", async (original) => ({ ...(await original<typeof import("../../api/client")>()), ...api }));

const PLACE = {
  id: "p1", slug: "shere-hills", name: "Shere Hills", status: "candidate", state: "Plateau", state_iso: "NG-PL",
  latitude: 9.9, longitude: 9.0, description: "Hills near Jos", access_notes: null,
  wikipedia_url: "https://en.wikipedia.org/wiki/Shere_Hills", wikidata_id: "Q1", photo_url: "https://x/1.jpg", photo_credit: "Ada (CC BY-SA 4.0)",
  tags: [{ slug: "hiking", weight: 0.8 }], accommodation_rates: 0, last_verified_at: null,
};

function renderAdmin(element: React.ReactNode, admin = true) {
  render(
    <ThemeProvider>
      <Providers auth={makeAuth({ isAdmin: admin, isSignedIn: admin, ready: true })}>
        <MemoryRouter initialEntries={["/app/admin"]}>
          <Routes>
            <Route path="/app/admin" element={<AdminGuard />}>
              <Route index element={element} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Providers>
    </ThemeProvider>
  );
}

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset());
  api.getMeta.mockResolvedValue(META);
  api.adminList.mockResolvedValue({ items: [PLACE], total: 1 });
});

describe("AdminGuard", () => {
  it("keeps everyone else out", () => {
    renderAdmin(<p>Secret</p>, false);
    expect(screen.getByText("Admins only")).toBeInTheDocument();
    expect(screen.queryByText("Secret")).not.toBeInTheDocument();
  });
});

describe("ReviewPage", () => {
  it("lists candidates and approves one with edits, then drops it from the queue", async () => {
    api.adminReview.mockResolvedValue({ ...PLACE, status: "published" });
    renderAdmin(<ReviewPage />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /Shere Hills/ }));
    const dialog = await screen.findByRole("dialog");
    const name = within(dialog).getByLabelText("Name");
    await user.clear(name);
    await user.type(name, "Shere Hills Plateau");
    await user.click(within(dialog).getByRole("button", { name: /Approve and publish/ }));
    await waitFor(() =>
      expect(api.adminReview).toHaveBeenCalledWith("p1", { action: "approve", changes: { name: "Shere Hills Plateau" } })
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(await screen.findByText("Nothing left to review")).toBeInTheDocument();
  });

  it("sends tag edits and rejects without sending edits", async () => {
    api.adminReview.mockResolvedValue({ ...PLACE, status: "rejected" });
    renderAdmin(<ReviewPage />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /Shere Hills/ }));
    const dialog = await screen.findByRole("dialog");
    await user.selectOptions(within(dialog).getByLabelText("Add something it offers"), "waterfalls");
    await user.click(within(dialog).getByRole("button", { name: "Remove Hiking" }));
    await user.click(within(dialog).getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(api.adminReview).toHaveBeenCalledWith("p1", { action: "fix", changes: { tags: [{ slug: "waterfalls", weight: 0.7 }] } }));
  });

  it("rejects a place that isn't a destination", async () => {
    api.adminReview.mockResolvedValue({ ...PLACE, status: "rejected" });
    renderAdmin(<ReviewPage />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /Shere Hills/ }));
    await user.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Reject" }));
    await waitFor(() => expect(api.adminReview).toHaveBeenCalledWith("p1", { action: "reject" }));
  });

  it("keeps the place open and says why when a decision fails", async () => {
    api.adminReview.mockRejectedValueOnce(new ApiError("Rejected places must be fixed before approval", 409, false));
    renderAdmin(<ReviewPage />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /Shere Hills/ }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /Approve and publish/ }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("must be fixed before approval");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("PricesPage", () => {
  const fill = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText("Place"), "shere");
    await user.click(await screen.findByRole("button", { name: /Shere Hills/ }));
    await user.type(screen.getByLabelText("Hotel or venue name"), "Hill Station Hotel");
    await user.type(screen.getByLabelText("Rate per night (₦)"), "45000");
    await user.type(screen.getByLabelText("Source page"), "https://hotel.example/rates");
  };

  it("records a rate with its source, and keeps the place for the next one", async () => {
    api.adminAddPrice.mockResolvedValue({ id: 1 });
    renderAdmin(<PricesPage />);
    const user = userEvent.setup();
    await fill(user);
    await user.click(screen.getByRole("button", { name: "Record rate" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Recorded Hill Station Hotel at ₦45,000 a night");
    expect(api.adminAddPrice).toHaveBeenCalledWith(
      expect.objectContaining({ component: "accommodation", tier: "mid", unit: "per_night", destination_id: "p1", subject: "Hill Station Hotel", amount: 45000, source_url: "https://hotel.example/rates" })
    );
    expect(screen.getByLabelText("Place")).toHaveValue("Shere Hills");
    expect(screen.getByLabelText("Hotel or venue name")).toHaveValue("");
  });

  it("lists every missing field instead of submitting", async () => {
    renderAdmin(<PricesPage />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Record rate" }));
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Choose a published place.");
    expect(alert).toHaveTextContent("Paste the web page");
    expect(api.adminAddPrice).not.toHaveBeenCalled();
  });

  it("says when the same price was already recorded", async () => {
    api.adminAddPrice.mockRejectedValueOnce(new ApiError("This exact price was already recorded", 409, false));
    renderAdmin(<PricesPage />);
    const user = userEvent.setup();
    await fill(user);
    await user.click(screen.getByRole("button", { name: "Record rate" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("already recorded");
  });

  it("turns a coverage gap into a pre-filled rate form", async () => {
    api.adminCoverage.mockResolvedValue([{ id: "p1", name: "Shere Hills", state: "Plateau", missing_tiers: ["budget", "premium"] }]);
    renderAdmin(<PricesPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "Coverage" }));
    await user.click(await screen.findByRole("button", { name: "Add premium" }));
    expect(await screen.findByLabelText("Place")).toHaveValue("Shere Hills");
    expect(screen.getByLabelText("Kind of stay")).toHaveValue("premium");
  });

  it("publishes the catalog and reports the version", async () => {
    api.adminPublish.mockResolvedValue({ catalog_version: 3, destination_count: 120 });
    renderAdmin(<PricesPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "Publish" }));
    await user.click(await screen.findByRole("button", { name: "Publish now" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Published catalog version 3 with 120 places.");
  });

  it("explains when there is nothing to publish", async () => {
    api.adminPublish.mockRejectedValueOnce(new ApiError("Nothing is published yet", 409, false));
    renderAdmin(<PricesPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "Publish" }));
    await user.click(await screen.findByRole("button", { name: "Publish now" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Nothing is published yet");
  });
});
