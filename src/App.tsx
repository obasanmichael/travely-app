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
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import SearchPage from "./components/Dashboard/SearchPage";
import SettingsPage from "./components/Dashboard/Settings";

// Wrapper component to use useLocation hook
const AppContent: React.FC<{
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}> = ({ isAuthenticated, onLogin, onLogout }) => {
  const location = useLocation();
  const isAuthOrDashboardPage =
    location.pathname === "/auth" || location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex justify-end lg:justify-center">
        <Toaster reverseOrder={false} />
      </div>
      {!isAuthOrDashboardPage && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      )}

      <main className={`flex-grow ${isAuthOrDashboardPage ? "" : "pt-20"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/auth"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Auth onLogin={onLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardLayout onLogout={onLogout} />
              ) : (
                <Navigate to={"/auth"} />
              )
            }
          >
            <Route path="" element={<Dashboard />} />
            <Route path="survey" element={<QuizForm />} />
            <Route path="explore" element={<SearchPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </main>

      {!isAuthOrDashboardPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      console.log("user signed out sucessfully");
    } catch (error) {
      toast.error("Error signing out:");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }
  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
};

export default App;
