import React from "react";
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
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import { isDashboardPath } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import HistoryPage from "./components/Dashboard/HistoryPage";
import HistoryDetailPage from "./components/Dashboard/HistoryDetailPage";
import SearchPage from "./components/Dashboard/SearchPage";
import SettingsPage from "./components/Dashboard/Settings";

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!user;
  const isHome = location.pathname === "/";
  const isAuthPage = location.pathname === "/auth";
  const isDashboard = isDashboardPath(location.pathname);
  const isAuthOrDashboardPage = isAuthPage || isDashboard;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface-base">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-travel-600 dark:border-travel-400"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-base text-primary">
      <div className="flex justify-end lg:justify-center">
        <Toaster reverseOrder={false} />
      </div>
      {!isAuthOrDashboardPage && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      )}

      <main
        className={`flex-grow ${
          isAuthOrDashboardPage ? "" : isHome ? "" : "pt-20"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/auth"
            element={
              isAuthenticated ? (
                <Navigate to="/recommendations" />
              ) : (
                <Auth />
              )
            }
          />
          <Route
            element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          >
            <Route path="/recommendations" element={<Dashboard />} />
            <Route path="survey" element={<QuizForm />} />
            <Route path="explore" element={<SearchPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="history/:runId" element={<HistoryDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </main>

      {!isAuthOrDashboardPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
