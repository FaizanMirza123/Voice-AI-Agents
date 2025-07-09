"use client";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const hideNavbarRoutes = ["/"];
  if (hideNavbarRoutes.includes(pathname)) return null;
  return (
    <nav className="w-full bg-gradient-to-r from-white via-pink-100 to-pink-300 px-8 py-4 flex justify-between items-center shadow-md">
      <span className="font-bold text-xl text-gray-800">Voice AI Agents</span>
      <div className="flex gap-8 items-center mx-auto">
        <a
          href="#"
          className="text-gray-700 font-medium hover:text-pink-600 transition"
        >
          Voice Assistants
        </a>
        <a
          href="#"
          className="text-gray-700 font-medium hover:text-pink-600 transition"
        >
          Integrations
        </a>
        <a
          href="#"
          className="text-gray-700 font-medium hover:text-pink-600 transition"
        >
          Pricing
        </a>
        <a
          href="#"
          className="text-gray-700 font-medium hover:text-pink-600 transition"
        >
          About
        </a>
      </div>
      <a
        href="#"
        className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-400 to-purple-500 shadow-md hover:from-pink-500 hover:to-purple-600 transition"
      >
        Contact Us
      </a>
    </nav>
  );
}
