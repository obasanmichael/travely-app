import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import QuizForm from "./components/Quiz/QuizForm";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import toast, { Toaster } from "react-hot-toast";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/firebase";

// Wrapper component to use useLocation hook
const AppContent: React.FC<{
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}> = ({ isAuthenticated, onLogin, onLogout }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      {!isAuthPage && <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />}

      <main className={`flex-grow ${isAuthPage ? "" : "pt-20"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth onLogin={onLogin}/>}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
          />
          <Route path="/quiz" element={<QuizForm />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false)
    } catch (error) {
      toast.error("Error signing out:")
    }
  }
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    });

    return () => unsubscribe();

  }, []);

  if (loading) {
    return <div className="flex justify-center h-screen items-center">Loading...</div>
  }
  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout} />
    </Router>
  );
};

export default App;
