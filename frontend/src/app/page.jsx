"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "@/services/apiService";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formLoading, setFormLoading] = useState({
    register: false,
    login: false,
  });

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  // Registration form state
  const [regForm, setRegForm] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormLoading((prev) => ({ ...prev, register: true }));
    try {
      // Convert email to lowercase for backend processing
      const formData = {
        ...regForm,
        email: regForm.email.toLowerCase(),
      };
      const response = await apiService.register(formData);
      login(response.access_token);
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setFormLoading((prev) => ({ ...prev, register: false }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormLoading((prev) => ({ ...prev, login: true }));
    try {
      // Convert email to lowercase for backend processing
      const formData = {
        ...loginForm,
        email: loginForm.email.toLowerCase(),
      };
      const response = await apiService.login(formData);
      login(response.access_token);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
    } finally {
      setFormLoading((prev) => ({ ...prev, login: false }));
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden fadeIn">
          {/* Header with Toggle */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex rounded-lg bg-white/20 p-1">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  !isSignUp
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  isSignUp
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-600">
                {isSignUp
                  ? "Join Voice AI Agents and start building"
                  : "Sign in to your Voice AI Agents account"}
              </p>
            </div>

            {/* Login Form */}
            {!isSignUp && (
              <form onSubmit={handleLogin} className="space-y-6 slideInUp">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={formLoading.login}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading.login ? "Signing In..." : "Sign In"}
                </button>
              </form>
            )}

            {/* Registration Form */}
            {isSignUp && (
              <form onSubmit={handleRegister} className="space-y-4 slideInUp">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) =>
                      setRegForm({ ...regForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={regForm.username}
                    onChange={(e) =>
                      setRegForm({ ...regForm, username: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="Choose a username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regForm.password}
                    onChange={(e) =>
                      setRegForm({ ...regForm, password: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={regForm.confirm_password}
                    onChange={(e) =>
                      setRegForm({
                        ...regForm,
                        confirm_password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={formLoading.register}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading.register ? "Creating Account..." : "Sign Up"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Voice AI Agents - Build intelligent voice assistants
          </p>
        </div>
      </div>
    </div>
  );
}
