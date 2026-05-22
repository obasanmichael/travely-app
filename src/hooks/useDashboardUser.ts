import { useAuth } from "../context/AuthContext";

interface UseDashboardUserResult {
  userName: string | null;
  loading: boolean;
}

export function useDashboardUser(): UseDashboardUserResult {
  const { user, loading } = useAuth();

  const userName =
    user?.displayName || user?.email?.split("@")[0] || "Traveler";

  return { userName: user ? userName : null, loading };
}
