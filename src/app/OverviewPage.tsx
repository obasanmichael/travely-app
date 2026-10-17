import { useAuth } from "../features/auth/authContext";
import { ButtonLink } from "../ui/Button";

function greeting(): string {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

export function OverviewPage() {
  const { user, isSignedIn } = useAuth();
  const name = isSignedIn ? (user?.displayName || user?.email?.split("@")[0] || "").split(" ")[0] : "";
  return (
    <section>
      <h2 className="m-0 font-serif text-5xl tracking-tight text-ink">
        {greeting()}
        {name ? `, ${name}` : ""}
      </h2>
      <p className="mb-8 mt-3 max-w-prose text-muted">Tell us your budget and what you enjoy, and we'll find places that fit.</p>
      <ButtonLink to="/app/plan" size="lg">
        Plan a trip
      </ButtonLink>
    </section>
  );
}
