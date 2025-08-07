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
// import { checkApiHealth } from "./utils/api";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    // useEffect(() => {
    //   const checkAuth = async () => {
    //     const user = await getCurrentUser();
    //     setIsAuthenticated(!user);
    //   };
  
    //   checkAuth();
    // }, []);
  
    // if (isAuthenticated === null) {
    //   // Still checking
    //   return (
    //     <div className="flex justify-center items-center h-64">
    //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    //     </div>
    //   );
    // }
  
  // const [apiStatus, setApiStatus] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const checkAPI = async () => {
  //     const isHealthy = await checkApiHealth();
  //     setApiStatus(isHealthy);
  //   };

  //   checkAPI();
  // }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar isAuthenticated={isAuthenticated} />

        {/* {apiStatus === false && (
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
        )} */}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                
                  <Dashboard />
                
              }
            />
            <Route
              path="/quiz"
              element={
                
                  <QuizForm />
                
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