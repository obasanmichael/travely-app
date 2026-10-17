import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { makeAuth } from "../../test/factories";
import { Providers } from "../../test/providers";
import { SignInPage } from "./SignInPage";

function renderPage(auth = makeAuth(), url = "/signin?next=/saved") {
  render(
    <Providers auth={auth}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/saved" element={<p>Saved page</p>} />
          <Route path="/" element={<p>Home page</p>} />
        </Routes>
      </MemoryRouter>
    </Providers>
  );
}

describe("SignInPage", () => {
  it("signs in with email and returns to where the user was", async () => {
    const auth = makeAuth();
    renderPage(auth);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "correct horse");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(auth.signInWithEmail).toHaveBeenCalledWith("ada@example.com", "correct horse");
    expect(await screen.findByText("Saved page")).toBeInTheDocument();
  });

  it("shows what went wrong and stays put", async () => {
    const auth = makeAuth({ signInWithEmail: vi.fn().mockRejectedValue(new Error("That email and password don't match.")) });
    renderPage(auth);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("don't match");
  });

  it("checks password length before creating an account", async () => {
    const auth = makeAuth();
    renderPage(auth, "/signin?mode=create");
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText(/^Password/), "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));
    expect(auth.createAccount).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("at least 8 characters");
  });

  it("never redirects off-site after signing in", async () => {
    renderPage(makeAuth(), "/signin?next=//evil.example");
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Continue with Google" }));
    expect(await screen.findByText("Home page")).toBeInTheDocument();
  });

  it("sends a reset link without saying whether the account exists", async () => {
    const auth = makeAuth();
    renderPage(auth);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Forgot your password?" }));
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));
    expect(await screen.findByRole("status")).toHaveTextContent("If ada@example.com has an account");
  });
});
