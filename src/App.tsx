import React, { useState } from "react";
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
// import { getCurrentUser } from "./firebase/firebase";
// import { checkApiHealth } from "./utils/api";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

// Wrapper component to use useLocation hook
const AppContent: React.FC<{
  isAuthenticated: boolean;
  onLogin: () => void;
}> = ({ isAuthenticated, onLogin }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Conditionally render navbar - hide on auth page */}
      {!isAuthPage && <Navbar isAuthenticated={isAuthenticated} />}

      <main className={`flex-grow ${isAuthPage ? "" : "pt-20"}`}>
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
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
          />
          <Route path="/quiz" element={<QuizForm />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
 
  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} onLogin={handleLogin} />
    </Router>
  );
};

export default App;
