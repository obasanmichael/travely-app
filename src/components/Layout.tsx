import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/" className="text-xl font-black tracking-tight text-ink no-underline">
          travely
        </Link>
      </header>
      <div id="main" className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-[13px] text-ink-soft sm:px-6">
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
