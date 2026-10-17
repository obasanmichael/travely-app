import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { mergeGuest } from "../../api/client";
import { auth } from "../../firebase/firebase";
import { AuthContext, type AuthValue } from "./authContext";
import { authMessage } from "./authMessages";


/** Run a sign-in that may replace a guest session, then move the guest's data across. */
async function replacingGuest(signIn: () => Promise<unknown>): Promise<void> {
  const guest = auth.currentUser?.isAnonymous ? auth.currentUser : null;
  const guestToken = guest ? await guest.getIdToken() : null;
  await signIn();
  if (guestToken && auth.currentUser && auth.currentUser.uid !== guest?.uid) {
    // Best effort: a failed merge mustn't block signing in.
    await mergeGuest(guestToken).catch(() => undefined);
  }
}

function wrap(action: () => Promise<unknown>): Promise<void> {
  return action().then(
    () => undefined,
    (error: unknown) => {
      throw new Error(authMessage(error instanceof FirebaseError ? error.code : "unknown"));
    }
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [ready, setReady] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (next) => {
        setUser(next);
        setReady(true);
      }),
    []
  );

  const value = useMemo<AuthValue>(() => {
    const google = new GoogleAuthProvider();
    return {
      user,
      ready,
      isSignedIn: Boolean(user && !user.isAnonymous),
      signInWithGoogle: () =>
        wrap(async () => {
          const current = auth.currentUser;
          if (current?.isAnonymous) {
            try {
              // Linking keeps the guest's uid, so saves and history stay put.
              await linkWithPopup(current, google);
              return;
            } catch (error) {
              if (!(error instanceof FirebaseError) || error.code !== "auth/credential-already-in-use") throw error;
            }
          }
          await replacingGuest(() => signInWithPopup(auth, google));
        }),
      signInWithEmail: (email, password) =>
        wrap(() => replacingGuest(() => signInWithEmailAndPassword(auth, email, password))),
      createAccount: (email, password) =>
        wrap(async () => {
          const current = auth.currentUser;
          if (current?.isAnonymous) {
            await linkWithCredential(current, EmailAuthProvider.credential(email, password));
          } else {
            await createUserWithEmailAndPassword(auth, email, password);
          }
        }),
      resetPassword: (email) => wrap(() => sendPasswordResetEmail(auth, email)),
      signOut: () => wrap(() => firebaseSignOut(auth)),
    };
  }, [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
