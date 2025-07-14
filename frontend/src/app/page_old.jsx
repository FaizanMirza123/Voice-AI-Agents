"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "@/services/apiService";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { login } = useAuth();
  const [loading, setLoading] = useState({
    register: false,
    login: false,
  });

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
    setLoading((prev) => ({ ...prev, register: true }));
    try {
      const response = await apiService.register(regForm);
      login(response.access_token);
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading((prev) => ({ ...prev, register: false }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, login: true }));
    try {
      const response = await apiService.login(loginForm);
      login(response.access_token);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: Login */}
      <div className="h-screen w-1/2 bg-gradient-to-r from-purple-300 to-pink-400 flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-8 bg-white bg-opacity-80 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-400 text-transparent bg-clip-text">
            Welcome Back
          </h2>
          <form onSubmit={handleLogin}>
            <label className="block mb-2 text-gray-700 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  email: e.target.value.toLowerCase(),
                })
              }
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
            <label className="block mb-2 text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="submit"
              disabled={loading.login}
              className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.login ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Registration */}
      <div className="h-screen w-1/2 bg-gradient-to-l from-purple-300 to-pink-400 flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-8 bg-white bg-opacity-80 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-400 text-transparent bg-clip-text">
            Create an account
          </h2>
          <form onSubmit={handleRegister}>
            <label className="block mb-2 text-gray-700 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={regForm.email}
              onChange={(e) =>
                setRegForm({ ...regForm, email: e.target.value.toLowerCase() })
              }
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter your email"
              required
            />
            <label className="block mb-2 text-gray-700 font-semibold">
              Username
            </label>
            <input
              type="text"
              value={regForm.username}
              onChange={(e) =>
                setRegForm({ ...regForm, username: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter your username"
              required
            />
            <label className="block mb-2 text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={regForm.password}
              onChange={(e) =>
                setRegForm({ ...regForm, password: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter your password"
              required
            />
            <label className="block mb-2 text-gray-700 font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              value={regForm.confirm_password}
              onChange={(e) =>
                setRegForm({ ...regForm, confirm_password: e.target.value })
              }
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Confirm your password"
              required
            />
            <button
              type="submit"
              disabled={loading.register}
              className="w-full py-2 rounded bg-gradient-to-r from-pink-500 to-purple-300 text-white font-bold text-lg shadow-md hover:from-pink-600 hover:to-purple-400 transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.register ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
