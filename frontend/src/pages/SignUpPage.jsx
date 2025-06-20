import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT COLUMN */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-10">
          {/* HEADER */}
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-indigo-600 rounded">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400">
              Get started with your free account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="block w-full pl-11 pr-4 py-2 bg-base-200 border border-gray-700 rounded placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pl-11 pr-4 py-2 bg-base-200 border border-gray-700 rounded placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full pl-11 pr-11 py-2 bg-base-200 border border-gray-700 rounded placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium transition-colors flex justify-center items-center"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2 text-white" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}
