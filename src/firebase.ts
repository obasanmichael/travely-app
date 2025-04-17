// src/firebase.js

// Import the core Firebase functionality and individual services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQE_ijRTJnWOuag8VZ9ZJhcxzRgHsXRf0",
  authDomain: "travely-app-6aa48.firebaseapp.com",
  projectId: "travely-app-6aa48",
  storageBucket: "travely-app-6aa48.appspot.com", // ✅ fixed typo (was: firebasestorage.app)
  messagingSenderId: "414995319228",
  appId: "1:414995319228:web:da62be90e69f7bdc9003b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use throughout your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
