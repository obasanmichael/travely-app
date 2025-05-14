// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// // import { useAuth } from "./context/AuthContext";
// // import OnboardingForm from "./components/onboarding/OnboardingForm";
// // import { Toaster } from "react-hot-toast";
// import Dashboard from "./pages/Dashboard";

// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// // Components
// import OnboardingQuiz from "./components/onboarding/OnboardingForm";
// import DestinationDetails from "./components/DestinationDetails";
// // import ProtectedRoute from "./components/ProtectedRoute";

// // Styles
// import "./App.css";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

// function App() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
//         <div className="text-3xl text-green-600 font-bold flex flex-col items-center">
//           <svg
//             className="animate-spin h-10 w-10 mb-4 text-green-600"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//             ></path>
//           </svg>
//           Loading Travely...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-teal-50">
//         <div className="flex-grow container mx-auto px-4 py-8">
//           <Routes>
//             <Route
//               path="/login"
//               element={!user ? <Login /> : <Navigate to="/dashboard" />}
//             />
//             <Route
//               path="/signup"
//               element={!user ? <Signup /> : <Navigate to="/dashboard" />}
//             />
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute user={user}>
//                   <Dashboard user={user} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/onboarding"
//               element={
//                 <ProtectedRoute user={user}>
//                   <OnboardingQuiz user={user} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/destination/:id"
//               element={
//                 <ProtectedRoute user={user}>
//                   <DestinationDetails user={user} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/"
//               element={<Navigate to={user ? "/dashboard" : "/login"} />}
//             />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import QuizForm from "./components/Quiz/QuizForm";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import { getCurrentUser } from "./firebase/firebase";
import { checkApiHealth } from "./utils/api";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsAuthenticated(!user);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Still checking
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAPI = async () => {
      const isHealthy = await checkApiHealth();
      setApiStatus(isHealthy);
    };

    checkAPI();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {apiStatus === false && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">API Error!</strong>
            <span className="block sm:inline">
              {" "}
              Unable to connect to recommendation service. Please try again
              later.
            </span>
          </div>
        )}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <QuizForm />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;