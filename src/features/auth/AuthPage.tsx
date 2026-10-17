import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SeasonRibbon } from "../../components/SeasonRibbon";
import { monthName } from "../../lib/format";
import { ThemeToggle } from "../../theme/ThemeToggle";
import { Button } from "../../ui/Button";
import { Logo } from "../../ui/Logo";
import { Field } from "../../ui/Field";
import { useFeatured } from "../places/useFeatured";
import { useAuth } from "./authContext";
import { safeNext } from "./safeNext";

export type AuthMode = "signin" | "signup" | "reset";

const COPY: Record<AuthMode, { title: string; lead: string; submit: string }> = {
  signin: {
    title: "Welcome back",
    lead: "Sign in to see your saved places and past trips on any device.",
    submit: "Sign in",
  },
  signup: {
    title: "Create your account",
    lead: "Keep your trips and saved places everywhere. Anything you saved as a guest comes with you.",
    submit: "Create account",
  },
  reset: {
    title: "Reset your password",
    lead: "Enter your email and we'll send you a link to choose a new one.",
    submit: "Send reset link",
  },
};

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 38.6 44 33.5 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function PhotoPanel() {
  const [place] = useFeatured(1);
  const month = new Date().getMonth() + 1;
  return (
    <aside aria-hidden={!place} className="relative hidden overflow-hidden bg-night lg:block">
      {place?.photo && <img src={place.photo.url} alt="" className="absolute inset-0 h-full w-full animate-kenburns object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/50" />
      <div className="relative flex h-full flex-col justify-between p-10 text-white">
        <Logo tone="light" size="lg" />
        {place && (
          <div className="max-w-md">
            <p className="m-0 font-serif text-4xl leading-tight">Your next trip starts with a few questions.</p>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <p className="m-0 font-semibold">{place.name}</p>
              <p className="m-0 mb-4 text-sm text-white/70">
                {place.state}. {monthName(month)} on the ribbon is outlined.
              </p>
              <SeasonRibbon scores={place.month_scores} month={month} />
            </div>
            {place.photo && (
              <a href={place.photo.file_page_url} target="_blank" rel="noreferrer" className="mt-4 block text-[11px] text-white/55 no-underline hover:text-white/80">
                Photo: {place.photo.author}, {place.photo.licence}
              </a>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const { signInWithGoogle, signInWithEmail, createAccount, resetPassword } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const next = safeNext(params.get("next"));
  const nextQuery = params.get("next") ? `?next=${encodeURIComponent(params.get("next") as string)}` : "";
  const copy = COPY[mode];

  const run = async (action: () => Promise<void>, done: () => void) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      done();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Sign-in didn't work. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (mode === "reset") {
      void run(() => resetPassword(email), () => setNotice(`If ${email} has an account, a reset link is on its way.`));
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }
    const action = mode === "signup" ? () => createAccount(email, password) : () => signInWithEmail(email, password);
    void run(action, () => navigate(next, { replace: true }));
  };

  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <PhotoPanel />
      <main className="relative flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          <h1 className="m-0 font-serif text-5xl leading-none tracking-tight text-ink">{copy.title}</h1>
          <p className="mb-0 mt-4 text-muted">{copy.lead}</p>

          {mode !== "reset" && (
            <>
              <Button
                variant="secondary"
                size="lg"
                disabled={busy}
                onClick={() => void run(signInWithGoogle, () => navigate(next, { replace: true }))}
                className="mt-8 w-full"
              >
                <GoogleMark />
                Continue with Google
              </Button>
              <div className="my-6 flex items-center gap-4 text-sm text-muted" aria-hidden="true">
                <span className="h-px flex-1 bg-line" />
                or with email
                <span className="h-px flex-1 bg-line" />
              </div>
            </>
          )}

          <form onSubmit={submit} noValidate className={`flex flex-col gap-4 ${mode === "reset" ? "mt-8" : ""}`}>
            <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            {mode !== "reset" && (
              <Field
                label="Password"
                type={show ? "text" : "password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint={mode === "signup" ? "At least 8 characters." : undefined}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-ink"
                  >
                    {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                }
              />
            )}
            {error && (
              <p role="alert" className="m-0 rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="m-0 rounded-xl bg-primary-wash px-4 py-3 text-sm text-ink">
                {notice}
              </p>
            )}
            <Button type="submit" size="lg" disabled={busy || !email} className="w-full">
              {busy ? "One moment…" : copy.submit}
            </Button>
          </form>

          <div className="mt-8 flex flex-col gap-3 text-sm text-muted">
            {mode === "signin" && (
              <>
                <p className="m-0">
                  New to Travely?{" "}
                  <Link to={`/signup${nextQuery}`} className="font-semibold text-primary">
                    Create an account
                  </Link>
                </p>
                <Link to="/reset" className="font-semibold text-primary">
                  Forgot your password?
                </Link>
              </>
            )}
            {mode === "signup" && (
              <p className="m-0">
                Already have an account?{" "}
                <Link to={`/signin${nextQuery}`} className="font-semibold text-primary">
                  Sign in
                </Link>
              </p>
            )}
            {mode === "reset" && (
              <p className="m-0">
                Remembered it?{" "}
                <Link to="/signin" className="font-semibold text-primary">
                  Sign in
                </Link>
              </p>
            )}
            <Link to="/app" className="mt-2 text-muted underline">
              Continue as a guest
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
