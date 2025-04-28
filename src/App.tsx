// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import OnboardingForm from "./components/onboarding/OnboardingForm";

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="font-sans">
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={user ? <OnboardingForm /> : <Navigate to="/login" />}
        />
        <Route path = "/onboardingform" element = {<OnboardingForm />}></Route>
      </Routes>
    </div>
  );
};

export default App;
