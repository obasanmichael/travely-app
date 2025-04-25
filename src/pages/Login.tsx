// src/pages/Login.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Failed to login. Check credentials.");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#242424]">
      <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-white">Log In</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full p-2 border rounded"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="w-full p-2 border rounded"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
