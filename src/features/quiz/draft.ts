import { DEFAULT_SEARCH, type SearchState } from "../search/searchState";

const KEY = "travely-quiz-draft";

export interface Draft {
  state: SearchState;
  step: number;
}

export function loadDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (typeof parsed.step !== "number" || typeof parsed.state?.budget !== "number") return null;
    // Fields added after a draft was saved fall back to their defaults.
    return { step: parsed.step, state: { ...DEFAULT_SEARCH, ...parsed.state } };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Without storage the quiz still works; answers just don't survive a reload.
  }
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
