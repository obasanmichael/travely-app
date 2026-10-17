import { ShieldAlert } from "lucide-react";
import { Outlet } from "react-router-dom";
import { ButtonLink } from "../../ui/Button";
import { EmptyState } from "../../ui/EmptyState";
import { useAuth } from "../auth/authContext";

/** Hides admin pages from everyone else. The server checks the claim on every call as well. */
export function AdminGuard() {
  const { isAdmin, ready } = useAuth();
  if (!ready) return null;
  if (!isAdmin) {
    return (
      <EmptyState
        Icon={ShieldAlert}
        title="Admins only"
        body="This area is for the people who review places and prices. If that's you, sign in with your admin account."
        action={<ButtonLink to="/signin?next=/app/admin/review">Sign in</ButtonLink>}
      />
    );
  }
  return <Outlet />;
}
