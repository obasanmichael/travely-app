import React, { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
interface SignupFormProps {
  onSignup: () => void;
}
const SignupForm: React.FC<SignupFormProps> = ({ onSignup }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Simple password strength checker
    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    setPasswordStrength(strength);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // Basic validation
    if (password !== confirmPassword) {
      setIsLoading(false);
      setError("Passwords don't match");
      return;
    }
    if (passwordStrength < 3) {
      setIsLoading(false);
      setError("Please choose a stronger password");
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (fullName && email && password) {
        onSignup();
      } else {
        setError("Please fill in all fields");
      }
    }, 1000);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="John Doe"
          required
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="name@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            className="block w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {/* Password strength indicator */}
        {password && (
          <div className="mt-2">
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-1/4 rounded-full ${
                    i < passwordStrength ? "bg-blue-500" : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-xs mt-1 text-gray-600">
              {passwordStrength === 0 && "Very weak"}
              {passwordStrength === 1 && "Weak"}
              {passwordStrength === 2 && "Medium"}
              {passwordStrength === 3 && "Strong"}
              {passwordStrength === 4 && "Very strong"}
            </p>
          </div>
        )}
        <div className="space-y-1 mt-1">
          <div className="flex items-center text-xs">
            {password.length >= 8 ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
            )}
            <span
              className={
                password.length >= 8 ? "text-green-600" : "text-gray-600"
              }
            >
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center text-xs">
            {/[A-Z]/.test(password) ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
            )}
            <span
              className={
                /[A-Z]/.test(password) ? "text-green-600" : "text-gray-600"
              }
            >
              At least one uppercase letter
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            required
          />
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-red-600">Passwords don't match</p>
        )}
      </div>
      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          required
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>
      <button
        type="submit"
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLoading ? "opacity-75 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="h-5 w-5 mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
            </svg>
          </button>
          <button
            type="button"
            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="h-5 w-5 mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
            </svg>
          </button>
          <button
            type="button"
            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="h-5 w-5 mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};
export default SignupForm;
