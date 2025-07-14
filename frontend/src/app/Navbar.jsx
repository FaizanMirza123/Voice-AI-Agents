"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();

  const hideNavbarRoutes = ["/"];
  if (hideNavbarRoutes.includes(pathname)) return null;

  return (
    <nav className="w-full bg-gradient-to-r from-white via-pink-100 to-pink-300 px-8 py-4 flex justify-between items-center shadow-md">
      <Link
        href={isAuthenticated() ? "/dashboard" : "/"}
        className="font-bold text-xl text-gray-800"
      >
        Voice AI Agents
      </Link>

      <div className="flex gap-8 items-center mx-auto">
        {isAuthenticated() ? (
          <>
            <Link
              href="/dashboard"
              className="text-gray-700 font-medium hover:text-pink-600 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/assistants"
              className="text-gray-700 font-medium hover:text-pink-600 transition"
            >
              Assistants
            </Link>
            <Link
              href="/call-logs"
              className="text-gray-700 font-medium hover:text-pink-600 transition"
            >
              Call Logs
            </Link>
            <Link
              href="/phone-numbers"
              className="text-gray-700 font-medium hover:text-pink-600 transition"
            >
              Phone Numbers
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/pricing"
              className="text-gray-700 font-medium hover:text-pink-600 transition"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-gray-700 font-medium hover:text-pink-600 transition"
            >
              About
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated() ? (
          <>
            <span className="text-gray-700">Welcome, {user?.sub}</span>
            <button
              onClick={logout}
              className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-500 shadow-md hover:from-pink-500 hover:to-purple-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/contact"
            className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-500 shadow-md hover:from-pink-500 hover:to-purple-600 transition"
          >
            Contact Us
          </Link>
        )}
      </div>
    </nav>
  );
}
