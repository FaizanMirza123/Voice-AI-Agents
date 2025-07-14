"use client";
import axios from "axios";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
export default function Home() {
  let api = "http://localhost:8000"; // Replace with your actual API endpoint during deployment
  //Normal Submission of Registeration
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailLog, SetEmailLog] = useState("");
  const [passwordLog, setPasswordlog] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios
      .post(`${api}/register`, {
        email,
        username,
        password,
        confirm_password: confirmPassword,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.access_token);
        toast.success(res.data.msg);
        window.location.href = "/Home";
      })
      .catch((err) => {
        toast.error("Registration failed. Please try again Later.");
      });
  };
  const handleLogin = async (event) => {
    event.preventDefault();

    axios
      .post(`${api}/login`, {
        email: emailLog,
        password: passwordLog,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.access_token);
        toast.success("Login successful");
        window.location.href = "/Home";
      });
  };
  return (
    // First div of 2 columns that divides in login and registration
    <div className="min-h-screen grid grid-cols-2">
      <Toaster />
      {/* Left side: Login Side */}
      <div className="h-full w-full bg-gradient-to-r from-white to-gray-200 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-md p-8 bg-white bg-opacity-80 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-400 text-transparent bg-clip-text">
            Sign in to your account
          </h2>
          <form>
            <label className="block mb-2 text-gray-700 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={emailLog}
              onChange={(e) => {
                SetEmailLog(e.target.value);
              }}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
            <label className="block mb-2 text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={passwordLog}
              onChange={(e) => {
                setPasswordlog(e.target.value);
              }}
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
            />
            <button
              type="submit"
              onClick={handleLogin}
              className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-300 text-white font-bold text-lg shadow-md hover:from-purple-600 hover:to-pink-400 transition"
            >
              Log In
            </button>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-3 text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="/fake-google-login"
              className="flex items-center justify-center gap-2 border border-gray-300 rounded py-2 bg-white bg-opacity-60 hover:bg-opacity-80 transition"
            >
              <img src="/Google.svg" alt="Google" className="w-5 h-5 mr-3" />
              <span className="text-gray-700 font-medium">
                Sign in with Google
              </span>
            </a>
            <a
              href="/fake-facebook-login"
              className="flex items-center justify-center gap-2 border border-gray-300 rounded py-2 bg-white bg-opacity-60 hover:bg-opacity-80 transition"
            >
              <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
              <span className="text-gray-700 font-medium">
                Sign in with Facebook
              </span>
            </a>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Voice AI Agents. All rights
          reserved.
        </div>
      </div>

      {/* Right side: Registeration Side */}
      <div className="h-full w-full bg-gradient-to-l from-black to-gray-800 flex flex-col justify-center items-center relative">
        <div className="w-full max-w-md p-8 bg-black bg-opacity-70 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-gray-200 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full mb-4 px-4 py-2 border border-gray-600 rounded bg-gray-900 bg-opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
            <label className="block mb-2 text-gray-200 font-semibold">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="w-full mb-4 px-4 py-2 border border-gray-600 rounded bg-gray-900 bg-opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Choose a username"
            />
            <label className="block mb-2 text-gray-200 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full mb-4 px-4 py-2 border border-gray-600 rounded bg-gray-900 bg-opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
            />
            <label className="block mb-2 text-gray-200 font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className="w-full mb-6 px-4 py-2 border border-gray-600 rounded bg-gray-900 bg-opacity-60 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Confirm your password"
            />
            <button
              type="submit"
              className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-300 text-white font-bold text-lg shadow-md hover:from-purple-600 hover:to-pink-400 transition"
            >
              Sign Up
            </button>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-600" />
            <span className="mx-3 text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-600" />
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="/fake-google-signup"
              className="flex items-center justify-center gap-2 border border-gray-400 rounded py-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5 mr-3" />
              <span className="text-black font-medium">
                Sign up with Google
              </span>
            </a>
            <a
              href="/fake-facebook-signup"
              className="flex items-center justify-center gap-2 border border-gray-400 rounded py-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition"
            >
              <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
              <span className="text-black font-medium">
                Sign up with Facebook
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
