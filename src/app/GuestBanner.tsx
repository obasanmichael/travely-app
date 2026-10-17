import { X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/authContext";

const KEY = "travely-guest-banner-dismissed";

function wasDismissed(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function GuestBanner() {
  const { isSignedIn, ready } = useAuth();
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(wasDismissed);
  if (!ready || isSignedIn || hidden) return null;
  return (
    <div role="status" className="flex items-center justify-between gap-3 border-b border-line bg-primary-wash px-4 py-2.5 text-sm text-ink sm:px-8">
      <p className="m-0">
        You're exploring as a guest, so your trips live on this device only.{" "}
        <Link to={`/signup?next=${encodeURIComponent(pathname)}`} className="font-semibold text-primary">
          Create an account
        </Link>{" "}
        to keep them everywhere.
      </p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {
            // Dismissal just won't persist.
          }
        }}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted hover:bg-line hover:text-ink"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
