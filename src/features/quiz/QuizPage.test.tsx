import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { META, response } from "../../test/fixtures";
import { Providers } from "../../test/providers";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { QuizPage } from "./QuizPage";

const api = vi.hoisted(() => ({ getMeta: vi.fn(), getRecommendations: vi.fn(), getBudgetBand: vi.fn() }));
vi.mock("../../api/client", async (original) => ({
  ...(await original<typeof import("../../api/client")>()),
  getMeta: api.getMeta,
  getRecommendations: api.getRecommendations,
  getBudgetBand: api.getBudgetBand,
}));

function Trip() {
  const location = useLocation();
  return <p>Trip page {location.pathname}</p>;
}

function renderQuiz() {
  render(
    <ThemeProvider>
      <Providers>
        <MemoryRouter initialEntries={["/app/plan"]}>
          <Routes>
            <Route path="/app/plan" element={<QuizPage />} />
            <Route path="/app/trips/:id" element={<Trip />} />
          </Routes>
        </MemoryRouter>
      </Providers>
    </ThemeProvider>
  );
}

const next = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole("button", { name: /Continue/ }));

describe("QuizPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    api.getMeta.mockResolvedValue(META);
    api.getBudgetBand.mockResolvedValue({ band: "Medium", per_person_per_day: 50000 });
    api.getRecommendations.mockReset();
  });

  it("asks one question at a time and tracks progress", async () => {
    renderQuiz();
    expect(await screen.findByText("Where are you starting from?")).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 8")).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Osun" }));
    await next(user);
    expect(await screen.findByText("When are you going?")).toBeInTheDocument();
    expect(screen.getByText("Question 2 of 8")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(await screen.findByText("Where are you starting from?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Osun" })).toHaveAttribute("aria-pressed", "true");
  });

  it("filters the state list as you type", async () => {
    renderQuiz();
    await screen.findByText("Where are you starting from?");
    await userEvent.setup().type(screen.getByLabelText("Search states"), "osu");
    expect(screen.queryByRole("button", { name: "Lagos" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Osun" })).toBeInTheDocument();
  });

  it("walks every question, reviews, and generates a trip", async () => {
    api.getRecommendations.mockResolvedValue(response({ run_id: "run-42" }));
    renderQuiz();
    const user = userEvent.setup();
    await screen.findByText("Where are you starting from?");
    await user.click(screen.getByRole("button", { name: "Osun" }));
    await next(user);
    await user.click(await screen.findByRole("button", { name: "December" }));
    await next(user);
    await user.click(await screen.findByRole("button", { name: "More days" }));
    await next(user);
    await user.click(await screen.findByRole("button", { name: "More travellers" }));
    await next(user);
    const budget = await screen.findByLabelText("Total budget in naira, for everyone");
    await user.clear(budget);
    await user.type(budget, "400000");
    expect(await screen.findByText("medium")).toBeInTheDocument();
    await next(user);
    await user.click(await screen.findByRole("button", { name: /Treat myself/ }));
    await next(user);
    await user.click(await screen.findByRole("button", { name: "Waterfalls" }));
    await next(user);
    await next(user);

    expect(await screen.findByText("Ready when you are.")).toBeInTheDocument();
    expect(screen.getByText("₦400,000 total")).toBeInTheDocument();
    expect(screen.getByText("December")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Find my places/ }));

    await waitFor(() => expect(screen.getByText("Trip page /app/trips/run-42")).toBeInTheDocument(), { timeout: 4000 });
    expect(api.getRecommendations).toHaveBeenCalledWith(
      expect.objectContaining({
        origin_state: "NG-OS", month: 12, days: 4, travellers: 2, budget: 400_000, tier: "premium",
        interests: { waterfalls: "love" },
      }),
      expect.any(String)
    );
    expect(sessionStorage.getItem("travely-quiz-draft")).toBeNull();
  });

  it("cycles an interest from love to like to off", async () => {
    renderQuiz();
    const user = userEvent.setup();
    await screen.findByText("Where are you starting from?");
    await user.click(screen.getByRole("button", { name: /Skip to review/ }));
    await user.click(await screen.findByRole("button", { name: "Edit into" }));
    const tile = await screen.findByRole("button", { name: "Hiking" });
    await user.click(tile);
    expect(screen.getByRole("button", { name: "Hiking, love it" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Hiking, love it" }));
    expect(screen.getByRole("button", { name: "Hiking, like it" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Hiking, like it" }));
    expect(screen.getByRole("button", { name: "Hiking" })).toBeInTheDocument();
  });

  it("keeps answers when the user leaves and comes back", async () => {
    const first = render(
      <ThemeProvider>
        <Providers>
          <MemoryRouter initialEntries={["/app/plan"]}>
            <QuizPage />
          </MemoryRouter>
        </Providers>
      </ThemeProvider>
    );
    await screen.findByText("Where are you starting from?");
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Osun" }));
    await next(user);
    first.unmount();

    renderQuiz();
    expect(await screen.findByText("When are you going?")).toBeInTheDocument();
  });

  it("says what failed and lets the user retry", async () => {
    api.getRecommendations.mockRejectedValue(Object.assign(new Error("x"), {}));
    const { ApiError } = await import("../../api/client");
    api.getRecommendations.mockRejectedValueOnce(new ApiError("Can't reach Travely. Check your connection and try again.", 0, true));
    renderQuiz();
    const user = userEvent.setup();
    await screen.findByText("Where are you starting from?");
    await user.click(screen.getByRole("button", { name: /Skip to review/ }));
    await user.click(await screen.findByRole("button", { name: /Find my places/ }));
    expect(await screen.findByRole("alert", {}, { timeout: 4000 })).toHaveTextContent("Can't reach Travely");
    expect(screen.getByRole("button", { name: /Find my places/ })).toBeEnabled();
  });
});
