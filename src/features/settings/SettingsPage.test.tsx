import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/client";
import { makeAuth } from "../../test/factories";
import { META } from "../../test/fixtures";
import { Providers } from "../../test/providers";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { SettingsPage } from "./SettingsPage";

const api = vi.hoisted(() => ({
  getMeta: vi.fn(), getProfile: vi.fn(), patchProfile: vi.fn(), downloadMyData: vi.fn(), deleteMyAccount: vi.fn(),
}));
vi.mock("../../api/client", async (original) => ({ ...(await original<typeof import("../../api/client")>()), ...api }));
vi.mock("firebase/auth", async (original) => ({ ...(await original<typeof import("firebase/auth")>()), updateProfile: vi.fn().mockResolvedValue(undefined) }));

const PROFILE = {
  email: "ada@example.com", display_name: "Ada Obi", home_state: "NG-LA", analytics_consent: false, marketing_consent: true,
  preferences: { tier: "mid", pace: "balanced", interests: { hiking: "love" } },
};

function renderSettings(auth = makeAuth({ user: { uid: "u1", email: "ada@example.com", displayName: "Ada Obi" } as never, isSignedIn: true })) {
  const signOut = auth.signOut;
  render(
    <ThemeProvider>
      <Providers auth={auth}>
        <MemoryRouter initialEntries={["/app/settings"]}>
          <SettingsPage />
        </MemoryRouter>
      </Providers>
    </ThemeProvider>
  );
  return { signOut };
}

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.values(api).forEach((fn) => fn.mockReset());
    api.getMeta.mockResolvedValue(META);
    api.getProfile.mockResolvedValue(PROFILE);
    api.patchProfile.mockResolvedValue(PROFILE);
  });

  it("loads the profile and saves changes", async () => {
    renderSettings();
    const name = await screen.findByLabelText("Name");
    await waitFor(() => expect(name).toHaveValue("Ada Obi"));
    const user = userEvent.setup();
    await user.clear(name);
    await user.type(name, "Ada Obi-Eze");
    await user.selectOptions(screen.getByLabelText("Home state"), "NG-OS");
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Profile saved.");
    expect(api.patchProfile).toHaveBeenCalledWith({ display_name: "Ada Obi-Eze", home_state: "NG-OS" });
  });

  it("won't save an empty name, and reports server errors plainly", async () => {
    renderSettings();
    const name = await screen.findByLabelText("Name");
    await waitFor(() => expect(name).toHaveValue("Ada Obi"));
    const user = userEvent.setup();
    await user.clear(name);
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a name to save.");
    expect(api.patchProfile).not.toHaveBeenCalled();

    api.patchProfile.mockRejectedValueOnce(new ApiError("Unknown state", 422, false));
    await user.type(name, "Ada");
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Unknown state");
  });

  it("saves trip preferences the quiz will start from", async () => {
    renderSettings();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("tab", { name: "Preferences" }));
    await user.click(await screen.findByRole("button", { name: /Treat myself/ }));
    await user.click(screen.getByRole("button", { name: "Packed" }));
    await user.click(screen.getByRole("button", { name: "Save preferences" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Preferences saved");
    expect(api.patchProfile).toHaveBeenCalledWith({ preferences: { tier: "premium", pace: "packed", interests: { hiking: "love" } } });
  });

  it("switches the theme and remembers it", async () => {
    renderSettings();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("tab", { name: "Appearance" }));
    await user.click(screen.getByRole("radio", { name: /Dark/ }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("travely-theme")).toBe("dark");
  });

  it("changes a privacy choice, and puts it back if saving fails", async () => {
    renderSettings();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("tab", { name: "Privacy and data" }));
    const analytics = await screen.findByRole("switch", { name: "Share anonymous usage" });
    await user.click(analytics);
    expect(api.patchProfile).toHaveBeenCalledWith({ analytics_consent: true });

    api.patchProfile.mockRejectedValueOnce(new ApiError("Something went wrong on our side. Try again.", 500, true));
    await user.click(screen.getByRole("switch", { name: "Product updates by email" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong");
    await waitFor(() => expect(screen.getByRole("switch", { name: "Product updates by email" })).toBeChecked());
  });

  it("downloads the user's data", async () => {
    api.downloadMyData.mockResolvedValue(undefined);
    renderSettings();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("tab", { name: "Privacy and data" }));
    await user.click(screen.getByRole("button", { name: /Download my data/ }));
    expect(api.downloadMyData).toHaveBeenCalled();
  });

  it("only deletes the account after the user types delete", async () => {
    api.deleteMyAccount.mockResolvedValue(undefined);
    const { signOut } = renderSettings();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("tab", { name: "Privacy and data" }));
    await user.click(screen.getByRole("button", { name: /Delete my account/ }));
    const confirmButton = await screen.findByRole("button", { name: "Delete account" });
    expect(confirmButton).toBeDisabled();
    await user.type(screen.getByLabelText("Type delete"), "delete");
    await user.click(confirmButton);
    await waitFor(() => expect(api.deleteMyAccount).toHaveBeenCalled());
    expect(signOut).toHaveBeenCalled();
  });

  it("limits a guest with no session to appearance and explains why", async () => {
    renderSettings(makeAuth({ user: null }));
    expect(await screen.findByRole("tab", { name: "Profile" })).toBeDisabled();
    expect(screen.getByRole("tab", { name: "Appearance" })).toBeEnabled();
    expect(screen.getByText(/Plan a trip or sign in/)).toBeInTheDocument();
  });
});
