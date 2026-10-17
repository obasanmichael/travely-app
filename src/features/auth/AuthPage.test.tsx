import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeAuth } from "../../test/factories";
import { Providers } from "../../test/providers";
import { ThemeProvider } from "../../theme/ThemeProvider";
import { AuthPage, type AuthMode } from "./AuthPage";
import { safeNext } from "./safeNext";

vi.mock("../../api/client", async (original) => ({
  ...(await original<typeof import("../../api/client")>()),
  getFeatured: vi.fn().mockResolvedValue([]),
}));

function renderPage(mode: AuthMode, auth = makeAuth(), url = "/signin?next=/app/saved") {
  render(
    <ThemeProvider>
      <Providers auth={auth}>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/signin" element={<AuthPage mode={mode} />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/app/saved" element={<p>Saved page</p>} />
            <Route path="/app" element={<p>App home</p>} />
          </Routes>
        </MemoryRouter>
      </Providers>
    </ThemeProvider>
  );
}

describe("AuthPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("only follows same-site next paths", () => {
    expect(safeNext("/app/saved")).toBe("/app/saved");
    expect(safeNext("//evil.example")).toBe("/app");
    expect(safeNext("https://evil.example")).toBe("/app");
    expect(safeNext(null)).toBe("/app");
  });

  it("signs in with email and returns to where the user was", async () => {
    const auth = makeAuth();
    renderPage("signin", auth);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "correct horse");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(auth.signInWithEmail).toHaveBeenCalledWith("ada@example.com", "correct horse");
    expect(await screen.findByText("Saved page")).toBeInTheDocument();
  });

  it("shows what went wrong and stays put", async () => {
    const auth = makeAuth({ signInWithEmail: vi.fn().mockRejectedValue(new Error("That email and password don't match.")) });
    renderPage("signin", auth);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("don't match");
  });

  it("checks password length before creating an account", async () => {
    const auth = makeAuth();
    renderPage("signup", auth, "/signup");
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(auth.createAccount).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("at least 8 characters");
  });

  it("lets people reveal their password", async () => {
    renderPage("signin");
    const user = userEvent.setup();
    const field = screen.getByLabelText("Password");
    expect(field).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(field).toHaveAttribute("type", "text");
  });

  it("goes to the app after Google sign-in when there's no next", async () => {
    renderPage("signin", makeAuth(), "/signin");
    await userEvent.setup().click(screen.getByRole("button", { name: "Continue with Google" }));
    expect(await screen.findByText("App home")).toBeInTheDocument();
  });

  it("sends a reset link without saying whether the account exists", async () => {
    const auth = makeAuth();
    renderPage("signin", auth, "/signin");
    const user = userEvent.setup();
    // Reset is its own page; render it directly.
    renderPage("reset", auth, "/signin");
    await user.type(screen.getAllByLabelText("Email").at(-1)!, "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));
    expect(await screen.findByRole("status")).toHaveTextContent("If ada@example.com has an account");
  });
});
