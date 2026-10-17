import { ButtonLink } from "../ui/Button";
import { Logo } from "../ui/Logo";

export function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
      <div>
        <Logo size="lg" className="justify-center" />
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
