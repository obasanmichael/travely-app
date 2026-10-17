import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Firebase only handles sign-in now; all data lives behind the Travely API.
const firebaseConfig = {
  apiKey: requireEnv("VITE_FIREBASE_API_KEY"),
  authDomain: requireEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("VITE_FIREBASE_PROJECT_ID"),
  appId: requireEnv("VITE_FIREBASE_APP_ID"),
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export { app, auth };
