import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/authContext";
import { useSaved } from "../features/saved/savedContext";

const navLink = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1.5 text-sm font-semibold no-underline ${
    isActive ? "bg-white/15 text-white" : "text-white/80 hover:text-white"
  }`;

export function Layout() {
  const { isSignedIn, user, signOut } = useAuth();
  const { ids, error } = useSaved();
  const location = useLocation();
  const next = encodeURIComponent(location.pathname + location.search);

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="bg-ink text-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-black tracking-tight text-white no-underline">
            travely
          </Link>
          <nav aria-label="Account" className="flex items-center gap-1">
            <NavLink to="/saved" className={navLink}>
              Saved{ids.size > 0 ? ` (${ids.size})` : ""}
            </NavLink>
            {isSignedIn && (
              <NavLink to="/searches" className={navLink}>
                Searches
              </NavLink>
            )}
            {isSignedIn ? (
              <button
                type="button"
                onClick={() => void signOut()}
                title={user?.email ?? undefined}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-white/80 hover:text-white"
              >
                Sign out
              </button>
            ) : (
              <Link
                to={`/signin?next=${next}`}
                className="ml-1 rounded-full bg-sun px-4 py-1.5 text-sm font-semibold text-ink no-underline hover:brightness-95"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      {error && (
        <p role="alert" className="m-0 bg-alert-wash px-4 py-2 text-center text-sm text-alert">
          {error}
        </p>
      )}
      <div id="main" className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-[13px] text-ink-soft sm:px-6">
          <p className="m-0">
            Places from <a className="underline" href="https://www.wikidata.org">Wikidata</a>, photos from{" "}
            <a className="underline" href="https://commons.wikimedia.org">Wikimedia Commons</a>, climate from{" "}
            <a className="underline" href="https://power.larc.nasa.gov">NASA POWER</a>, prices from the{" "}
            <a className="underline" href="https://nigerianstat.gov.ng">National Bureau of Statistics</a> and our own checks.
          </p>
          <p className="m-0">Costs are estimates to help you plan, not quotes.</p>
        </div>
      </footer>
    </div>
  );
}
