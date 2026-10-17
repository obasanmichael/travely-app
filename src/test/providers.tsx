import type { ReactNode } from "react";
import { AuthContext, type AuthValue } from "../features/auth/authContext";
import { makeAuth, makeSaved } from "./factories";
import { SavedContext, type SavedValue } from "../features/saved/savedContext";

export function Providers({
  children,
  auth = makeAuth(),
  saved = makeSaved(),
}: {
  children: ReactNode;
  auth?: AuthValue;
  saved?: SavedValue;
}) {
  return (
    <AuthContext.Provider value={auth}>
      <SavedContext.Provider value={saved}>{children}</SavedContext.Provider>
    </AuthContext.Provider>
  );
}
