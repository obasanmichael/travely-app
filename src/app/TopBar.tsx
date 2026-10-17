import * as Menu from "@radix-ui/react-dropdown-menu";
import { LogIn, LogOut, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/authContext";
import { ThemeToggle } from "../theme/ThemeToggle";
import { ButtonLink } from "../ui/Button";
import { titleFor } from "./nav";

function initials(name: string | null | undefined, email: string | null | undefined): string {
  const source = (name || email || "?").trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

const ITEM = "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink outline-none data-[highlighted]:bg-line";

export function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isSignedIn, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-line bg-bg/80 px-4 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <Link to="/app" className="font-serif text-2xl text-ink no-underline lg:hidden">
          travely
        </Link>
        <h1 className="m-0 hidden text-lg font-bold text-ink lg:block">{titleFor(pathname)}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isSignedIn ? (
          <Menu.Root>
            <Menu.Trigger
              aria-label="Account menu"
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-white outline-none ring-offset-2 ring-offset-bg focus-visible:ring-2 focus-visible:ring-sun"
            >
              {initials(user?.displayName, user?.email)}
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Content
                align="end"
                sideOffset={8}
                className="z-50 min-w-56 rounded-2xl border border-line bg-surface p-1.5 shadow-lift data-[state=open]:animate-[fade-in_150ms_ease-out]"
              >
                <div className="px-3 py-2.5">
                  <p className="m-0 text-sm font-semibold text-ink">{user?.displayName || "Your account"}</p>
                  <p className="m-0 text-[13px] text-muted">{user?.email}</p>
                </div>
                <Menu.Separator className="my-1 h-px bg-line" />
                <Menu.Item className={ITEM} onSelect={() => navigate("/app/settings")}>
                  <Settings className="h-4 w-4" aria-hidden="true" /> Settings
                </Menu.Item>
                <Menu.Item
                  className={ITEM}
                  onSelect={() => {
                    void signOut().then(() => navigate("/"));
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                </Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu.Root>
        ) : (
          <ButtonLink to={`/signin?next=${encodeURIComponent(pathname)}`} size="sm" variant="secondary">
            <LogIn className="h-4 w-4" aria-hidden="true" /> Sign in
          </ButtonLink>
        )}
      </div>
    </header>
  );
}
