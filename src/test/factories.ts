import { vi } from "vitest";
import type { AuthValue } from "../features/auth/authContext";
import type { SavedValue } from "../features/saved/savedContext";

export function makeAuth(overrides: Partial<AuthValue> = {}): AuthValue {
  return {
    user: null,
    ready: true,
    isSignedIn: false,
    signInWithGoogle: vi.fn().mockResolvedValue(undefined),
    signInWithEmail: vi.fn().mockResolvedValue(undefined),
    createAccount: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

export function makeSaved(overrides: Partial<SavedValue> = {}): SavedValue {
  return { ids: new Set(), error: null, toggle: vi.fn().mockResolvedValue(undefined), refresh: vi.fn(), ...overrides };
}
