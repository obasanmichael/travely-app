import { createContext, useContext } from "react";

export interface SavedValue {
  ids: ReadonlySet<string>;
  error: string | null;
  toggle: (destinationId: string) => Promise<void>;
  refresh: () => void;
}

export const SavedContext = createContext<SavedValue | null>(null);

export function useSaved(): SavedValue {
  const value = useContext(SavedContext);
  if (!value) throw new Error("useSaved must be used inside SavedProvider");
  return value;
}
