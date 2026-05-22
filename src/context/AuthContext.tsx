import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getUserDocument } from "../firebase/firestore";
import { ensureUserDocument } from "../services/userService";
import { clearUserLocalData } from "../lib/clientStorage";

interface User extends FirebaseUser {
  hasCompletedOnboarding: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  sendVerificationEmail: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await ensureUserDocument(
            currentUser.uid,
            currentUser.email,
            currentUser.displayName
          );
          setUser({
            ...currentUser,
            hasCompletedOnboarding: userDoc.hasCompletedOnboarding ?? false,
          });
        } catch (err) {
          console.error("Failed to load user document:", err);
          setUser({
            ...currentUser,
            hasCompletedOnboarding: false,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    await ensureUserDocument(
      userCredential.user.uid,
      userCredential.user.email,
      displayName ?? null
    );
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    clearUserLocalData();
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error("Not signed in");
    }
    await sendEmailVerification(auth.currentUser);
  };

  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    await currentUser.reload();
    const userDoc = await getUserDocument(currentUser.uid);
    if (userDoc) {
      setUser({
        ...currentUser,
        hasCompletedOnboarding: userDoc.hasCompletedOnboarding ?? false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, resetPassword, sendVerificationEmail, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
