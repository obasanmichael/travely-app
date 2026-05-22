const CACHE_PREFIX = "travelRecommendations";

export function recommendationsCacheKey(uid: string): string {
  return `${CACHE_PREFIX}:${uid}`;
}

export function cacheRecommendations(
  uid: string,
  payload: unknown
): void {
  localStorage.setItem(recommendationsCacheKey(uid), JSON.stringify(payload));
}

export function readCachedRecommendations<T>(uid: string): T | null {
  const saved = localStorage.getItem(recommendationsCacheKey(uid));
  if (!saved) return null;
  try {
    return JSON.parse(saved) as T;
  } catch {
    localStorage.removeItem(recommendationsCacheKey(uid));
    return null;
  }
}

/** Clear all user-specific cached data on logout. */
export function clearUserLocalData(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(`${CACHE_PREFIX}:`) || key === CACHE_PREFIX) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
