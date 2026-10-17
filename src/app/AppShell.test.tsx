import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { makeAuth, makeSaved } from "../test/factories";
import { Providers } from "../test/providers";
import { ThemeProvider } from "../theme/ThemeProvider";
import { AppShell } from "./AppShell";
import { titleFor } from "./nav";

function renderShell(options: { signedIn?: boolean; admin?: boolean; saved?: number; url?: string } = {}) {
  const { signedIn = false, admin = false, saved = 0, url = "/app" } = options;
  render(
    <ThemeProvider>
      <Providers
        auth={makeAuth({ isSignedIn: signedIn, isAdmin: admin, ready: true })}
        saved={makeSaved({ ids: new Set(Array.from({ length: saved }, (_, i) => `d${i}`)) })}
      >
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<p>Overview content</p>} />
              <Route path="saved" element={<p>Saved content</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Providers>
    </ThemeProvider>
  );
}

describe("AppShell", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("frames the page with a sidebar, top bar and content outlet", () => {
    renderShell();
    expect(screen.getByRole("complementary", { name: "Sidebar" })).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Overview content")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Plan a trip" })[0]).toHaveAttribute("href", "/app/plan");
  });

  it("shows the saved count and hides admin links from non-admins", () => {
    renderShell({ saved: 3 });
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Review" })).not.toBeInTheDocument();
  });

  it("shows admin links to admins", () => {
    renderShell({ signedIn: true, admin: true });
    expect(screen.getByRole("link", { name: "Review" })).toHaveAttribute("href", "/app/admin/review");
    expect(screen.getByRole("link", { name: "Prices" })).toBeInTheDocument();
  });

  it("collapses the sidebar and remembers it", async () => {
    renderShell();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument();
    expect(localStorage.getItem("travely-sidebar-collapsed")).toBe("1");
  });

  it("nudges guests to create an account, and the nudge can be dismissed", async () => {
    renderShell();
    const banner = screen.getByRole("status");
    expect(banner).toHaveTextContent("exploring as a guest");
    await userEvent.setup().click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(sessionStorage.getItem("travely-guest-banner-dismissed")).toBe("1");
  });

  it("doesn't nudge people who are signed in", () => {
    renderShell({ signedIn: true });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Account menu" })).toBeInTheDocument();
  });

  it("titles the top bar from the route", () => {
    expect(titleFor("/app")).toBe("Overview");
    expect(titleFor("/app/trips/abc")).toBe("Your trip");
    expect(titleFor("/app/admin/prices")).toBe("Prices");
  });
});
