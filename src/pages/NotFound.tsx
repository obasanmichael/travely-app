import { ButtonLink } from "../ui/Button";

export function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
      <div>
        <p className="m-0 font-serif text-3xl text-ink">travely</p>
        <h1 className="m-0 mt-10 font-serif text-6xl leading-none tracking-tight text-ink">Lost the trail.</h1>
        <p className="mb-0 mt-4 text-muted">That page doesn't exist. The link may be old or mistyped.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink to="/">Go home</ButtonLink>
          <ButtonLink to="/app" variant="secondary">
            Open the app
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
