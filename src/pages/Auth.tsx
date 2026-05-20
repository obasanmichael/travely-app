import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import { BrandLogo } from "../components/ui/BrandLogo";
import { ThemeToggle } from "../components/ui/ThemeToggle";

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen bg-surface-base py-8 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="container mx-auto w-full">
        <div className="flex justify-end mb-4 lg:hidden">
          <ThemeToggle compact />
        </div>

        <div className="lg:hidden mb-6 flex justify-center">
          <BrandLogo showBackHint />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-surface-raised rounded-2xl overflow-hidden shadow-elevated border border-default">
          {/* Left side - Image */}
          <div className="hidden lg:block relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80')",
              }}
            ></div>
            <div className="absolute top-8 left-8 z-10">
              <BrandLogo variant="light" showBackHint />
            </div>
            <div className="absolute top-8 right-8 z-10">
              <ThemeToggle overlay />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Begin Your Journey</h2>
              <p className="text-lg opacity-90">
                Discover destinations that match your travel preferences and
                budget.
              </p>
              <div className="mt-6 flex space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://randomuser.me/api/portraits/men/${
                        20 + i
                      }.jpg`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">
                    Joined by 10,000+ travelers
                  </p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Forms */}
          <div className="py-12 px-5 md:px-12">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-primary">
                Welcome to Travely
              </h1>
              <p className="mt-2 text-secondary">
                Your personalized travel recommendation platform
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-default mb-8">
              <button
                className={`flex-1 py-3 font-medium text-center transition-colors ${
                  activeTab === "login"
                    ? "text-travel-600 dark:text-travel-400 border-b-2 border-travel-600 dark:border-travel-400"
                    : "text-muted hover:text-secondary"
                }`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={`flex-1 py-3 font-medium text-center transition-colors ${
                  activeTab === "signup"
                    ? "text-travel-600 dark:text-travel-400 border-b-2 border-travel-600 dark:border-travel-400"
                    : "text-muted hover:text-secondary"
                }`}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>
            </div>

            {/* Forms */}
            <div className="mt-6">
              {activeTab === "login" ? <LoginForm /> : <SignupForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
