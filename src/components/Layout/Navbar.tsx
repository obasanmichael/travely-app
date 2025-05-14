import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, getCurrentUser } from "../../firebase/firebase";
import { signOut } from "firebase/auth";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "User");
      }
    };

    checkAuthStatus();
  }, [location]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold">
                TravelyNG
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/dashboard"
                    ? "bg-blue-800 text-white"
                    : "text-gray-300 hover:bg-blue-700 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/quiz"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/quiz"
                    ? "bg-blue-800 text-white"
                    : "text-gray-300 hover:bg-blue-700 hover:text-white"
                }`}
              >
                Quiz
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <div className="flex items-center">
                <span className="text-sm mr-2">Hi, {userName}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-blue-700 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-blue-700 hover:text-white"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-700"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/dashboard"
                ? "bg-blue-800 text-white"
                : "text-gray-300 hover:bg-blue-700 hover:text-white"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/quiz"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/quiz"
                ? "bg-blue-800 text-white"
                : "text-gray-300 hover:bg-blue-700 hover:text-white"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Quiz
          </Link>
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-blue-700 hover:text-white"
            >
              Logout ({userName})
            </button>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-blue-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
