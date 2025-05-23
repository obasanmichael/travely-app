// src/firebase.js

// Import the core Firebase functionality and individual services
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

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
// Firebase configuration and functions
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDoc, 
  doc, 
  serverTimestamp,
  DocumentReference 
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { QuizFormData, UserPreferences } from '../components/types/types';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Check authentication state
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Save user preferences after quiz
export const saveUserPreferences = async (quizData: QuizFormData): Promise<DocumentReference | null> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('No user logged in');
      return null;
    }
    
    const userPreferences: Omit<UserPreferences, 'createdAt' | 'lastUpdated'> = {
      ...quizData,
      userId: user.uid,
    };
    
    // Add to Firestore with server timestamps
    const docRef = await addDoc(collection(db, 'userPreferences'), {
      ...userPreferences,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    });
    
    console.log('Preferences saved with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return null;
  }
};

// Get user's latest preferences
export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('No user logged in');
      return null;
    }
    
    // For simplicity, we're just getting the latest preferences
    // In a real app, you'd query by userId and sort by timestamp
    const prefsSnapshot = await getDoc(doc(db, 'userPreferences', user.uid));
    
    if (!prefsSnapshot.exists()) {
      return null;
    }
    
    const data = prefsSnapshot.data() as UserPreferences;
    return data;
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return null;
  }
};

export { db, auth };
