import { useEffect, useState } from "react";
import { getCurrentUser } from "../firebase/firebase";

interface UseDashboardUserResult {
  userName: string | null;
  loading: boolean;
}

export function useDashboardUser(): UseDashboardUserResult {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const user = await getCurrentUser();
        if (!cancelled && user) {
          setUserName(
            user.displayName || user.email?.split("@")[0] || "Traveler"
          );
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { userName, loading };
}
