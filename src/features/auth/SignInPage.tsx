import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./authContext";

type Mode = "signin" | "create" | "reset";

const TITLES: Record<Mode, string> = {
  signin: "Sign in to Travely",
  create: "Create your Travely account",
  reset: "Reset your password",
};

const SUBMIT: Record<Mode, string> = {
  signin: "Sign in",
  create: "Create account",
  reset: "Send reset link",
};

function safeNext(value: string | null): string {
  // Only same-site paths, so a crafted link can't bounce people elsewhere after sign-in.
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

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

const field = "w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-base text-ink focus:border-lagoon";

export function SignInPage() {
  const { signInWithGoogle, signInWithEmail, createAccount, resetPassword } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(params.get("mode") === "create" ? "create" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const next = safeNext(params.get("next"));

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
    if (mode === "create" && password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }
    const action = mode === "create" ? () => createAccount(email, password) : () => signInWithEmail(email, password);
    void run(action, () => navigate(next, { replace: true }));
  };

  const switchTo = (target: Mode) => {
    setMode(target);
    setError(null);
    setNotice(null);
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-24 pt-10 sm:px-6">
      <h1 className="m-0 text-3xl font-bold tracking-tight text-ink">{TITLES[mode]}</h1>
      <p className="mb-0 mt-2 text-ink-soft">
        {mode === "reset"
          ? "We'll email you a link to choose a new password."
          : "Keep your saved places and past searches on any device. Anything you saved as a guest comes with you."}
      </p>

      {mode !== "reset" && (
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() => void run(signInWithGoogle, () => navigate(next, { replace: true }))}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-line bg-surface px-5 py-3 font-semibold text-ink hover:border-ink disabled:opacity-60"
          >
            <GoogleMark />
            Continue with Google
          </button>
          <p className="my-6 text-center text-sm text-ink-soft">or use your email</p>
        </>
      )}

      <form onSubmit={submit} className={`flex flex-col gap-4 ${mode === "reset" ? "mt-8" : ""}`} noValidate>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
        </label>
        {mode !== "reset" && (
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Password
            <input
              type="password"
              autoComplete={mode === "create" ? "new-password" : "current-password"}
              required
              minLength={mode === "create" ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
            {mode === "create" && <span className="text-[13px] font-normal text-ink-soft">At least 8 characters.</span>}
          </label>
        )}

        {error && (
          <p role="alert" className="m-0 rounded-lg bg-alert-wash px-4 py-3 text-sm text-alert">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="m-0 rounded-lg bg-lagoon-wash px-4 py-3 text-sm text-ink">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !email}
          className="rounded-full bg-lagoon px-5 py-3 font-semibold text-white hover:bg-lagoon-deep disabled:opacity-60"
        >
          {busy ? "One moment…" : SUBMIT[mode]}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm text-ink-soft">
        {mode === "signin" && (
          <>
            <p className="m-0">
              New to Travely?{" "}
              <button type="button" onClick={() => switchTo("create")} className="font-semibold text-lagoon underline">
                Create an account
              </button>
            </p>
            <button type="button" onClick={() => switchTo("reset")} className="self-start font-semibold text-lagoon underline">
              Forgot your password?
            </button>
          </>
        )}
        {mode !== "signin" && (
          <p className="m-0">
            {mode === "create" ? "Already have an account? " : "Remembered it? "}
            <button type="button" onClick={() => switchTo("signin")} className="font-semibold text-lagoon underline">
              Sign in
            </button>
          </p>
        )}
        <Link to="/" className="mt-4 text-ink-soft underline">
          Keep browsing as a guest
        </Link>
      </div>
    </main>
  );
}
