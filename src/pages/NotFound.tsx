import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="m-0 text-3xl font-bold text-ink">This page doesn't exist</h1>
      <p className="mt-3 text-ink-soft">The link may be old or mistyped.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-lagoon px-5 py-2.5 font-semibold text-white no-underline">
        Plan a trip
      </Link>
    </main>
  );
}
