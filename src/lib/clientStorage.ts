const CACHE_PREFIX = "travelRecommendations";
const HISTORY_PREFIX = "travelRecommendationHistory";

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

function recommendationHistoryKey(uid: string): string {
  return `${HISTORY_PREFIX}:${uid}`;
}

export function cacheRecommendationRun<T extends { id?: string }>(
  uid: string,
  run: T
): void {
  const current = readCachedRecommendationRuns<T>(uid);
  const next = [
    run,
    ...current.filter((item) => item.id !== run.id),
  ].slice(0, 20);
  localStorage.setItem(recommendationHistoryKey(uid), JSON.stringify(next));
}

export function readCachedRecommendationRuns<T>(uid: string): T[] {
  const saved = localStorage.getItem(recommendationHistoryKey(uid));
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    localStorage.removeItem(recommendationHistoryKey(uid));
    return [];
  }
}

export function readCachedRecommendationRunById<T>(
  uid: string,
  runId: string
): T | null {
  return (
    readCachedRecommendationRuns<T & { id?: string }>(uid).find(
      (run) => run.id === runId
    ) ?? null
  );
}

/** Clear all user-specific cached data on logout. */
export function clearUserLocalData(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (
      key?.startsWith(`${CACHE_PREFIX}:`) ||
      key?.startsWith(`${HISTORY_PREFIX}:`) ||
      key === CACHE_PREFIX
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
