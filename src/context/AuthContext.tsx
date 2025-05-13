import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Define the extended shape of your user context
interface User extends FirebaseUser {
  hasCompletedOnboarding: boolean;
}

// Define the shape of your auth context
interface AuthContextType {
  user: User | null;
  loading: boolean; // Add loading state
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with an initial placeholder
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true, // Set loading to true initially
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
});

// Export a hook to use this context easily
export const useAuth = () => useContext(AuthContext);

// The provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

  // Keep track of the currently signed-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user data from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);

        // If user document doesn't exist in Firestore yet, create it
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            createdAt: new Date(),
            hasCompletedOnboarding: false, // Add this field to Firestore
          });
        } else {
          const userData = docSnap.data();
          // Set user with custom fields, including 'hasCompletedOnboarding'
          setUser({
            ...currentUser,
            hasCompletedOnboarding: userData?.hasCompletedOnboarding || false,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false after authentication state is determined
    });

    return () => unsubscribe();
  }, []);

  // Signup method
  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create user document in Firestore with 'hasCompletedOnboarding' as false
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
      hasCompletedOnboarding: false, // Add this field to Firestore
    });
  };

  // Login method
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout method
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
