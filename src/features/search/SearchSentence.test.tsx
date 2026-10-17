import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { META } from "../../test/fixtures";
import { SearchSentence } from "./SearchSentence";
import { DEFAULT_SEARCH } from "./searchState";

describe("SearchSentence", () => {
  it("submits the answers as a search", async () => {
    const onSubmit = vi.fn();
    render(<SearchSentence meta={META} initial={DEFAULT_SEARCH} onSubmit={onSubmit} />);
    const user = userEvent.setup();

    const budget = screen.getByLabelText("Total budget in naira, for everyone");
    await user.clear(budget);
    await user.type(budget, "250000");
    await user.selectOptions(screen.getByLabelText("Where you're starting from"), "NG-OS");
    await user.click(screen.getByRole("button", { name: "Waterfalls" }));
    await user.click(screen.getByRole("button", { name: "Like it" }));
    await user.click(screen.getByRole("button", { name: "Show me places" }));

    expect(budget).toHaveValue("250,000");
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ budget: 250_000, origin: "NG-OS", interests: { waterfalls: "like" } })
    );
  });

  it("explains what to fix instead of submitting", async () => {
    const onSubmit = vi.fn();
    render(<SearchSentence meta={META} initial={DEFAULT_SEARCH} onSubmit={onSubmit} />);
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText("Total budget in naira, for everyone"));
    await user.click(screen.getByRole("button", { name: "Show me places" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a budget of at least ₦1,000.");
  });

  it("reveals more options on request", async () => {
    render(<SearchSentence meta={META} initial={DEFAULT_SEARCH} onSubmit={vi.fn()} />);
    await userEvent.setup().click(screen.getByRole("button", { name: /More options/ }));
    expect(screen.getByLabelText("When are you going?")).toBeInTheDocument();
  });
});
