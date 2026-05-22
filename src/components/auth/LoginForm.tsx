import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { authInputClass } from "./authInputStyles";

const loginSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Signin successful! Redirecting...");
      navigate("/recommendations");
    } catch (error: unknown) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code: string }).code)
          : "";
      if (code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else if (code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = getValues("email");
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }
    setIsResetting(true);
    try {
      await resetPassword(email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error: unknown) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code: string }).code)
          : "";
      if (code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else {
        toast.error("Could not send reset email. Please try again.");
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-secondary"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={authInputClass}
            placeholder="name@example.com"
            required
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-secondary"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            className={`${authInputClass} pr-10`}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-muted" />
            ) : (
              <EyeIcon className="h-5 w-5 text-muted" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-travel-600 focus:ring-travel-500 border-default rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-secondary"
          >
            Remember me
          </label>
        </div>
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isResetting}
          className="text-sm font-medium text-travel-600 dark:text-travel-400 hover:text-travel-700 dark:hover:text-travel-300 disabled:opacity-60"
        >
          {isResetting ? "Sending..." : "Forgot password?"}
        </button>
      </div>
      <button
        type="submit"
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-travel-600 hover:bg-travel-700 dark:bg-travel-500 dark:hover:bg-travel-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-travel-500 dark:focus:ring-offset-slate-900 ${
          isLoading ? "opacity-75 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};
export default LoginForm;
