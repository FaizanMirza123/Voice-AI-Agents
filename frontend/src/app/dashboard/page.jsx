"use client";
import { useEffect, useState } from "react";
import { apiService } from "@/services/apiService";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState({
    assistants: 0,
    calls: 0,
    phoneNumbers: 0,
  });
  const [recentAssistants, setRecentAssistants] = useState([]);
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [assistants, calls, phoneNumbers] = await Promise.all([
        apiService.getAssistants(),
        apiService.getCalls(),
        apiService.getPhoneNumbers(),
      ]);

      setStats({
        assistants: assistants.length,
        calls: calls.length,
        phoneNumbers: phoneNumbers.length,
      });

      setRecentAssistants(assistants.slice(0, 5));
      setRecentCalls(calls.slice(0, 5));
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your voice agents.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Assistants
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.assistants}
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Calls
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.calls}
                  </p>
                </div>
                <div className="bg-pink-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phone Numbers
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.phoneNumbers}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link
              href="/assistants"
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <span className="font-medium">Create Assistant</span>
              </div>
            </Link>

            <Link
              href="/call-logs"
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-pink-100 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <span className="font-medium">View Call Logs</span>
              </div>
            </Link>

            <Link
              href="/phone-numbers"
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Manage Numbers</span>
              </div>
            </Link>

            <Link
              href="/pricing"
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <span className="font-medium">View Pricing</span>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Assistants */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Assistants
                </h2>
                <Link
                  href="/assistants"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentAssistants.length > 0 ? (
                  recentAssistants.map((assistant) => (
                    <div
                      key={assistant.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="bg-purple-100 rounded-full p-2">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {assistant.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {assistant.createdAt
                            ? new Date(assistant.createdAt).toLocaleDateString()
                            : "Recently created"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No assistants yet. Create your first one!
                  </p>
                )}
              </div>
            </div>

            {/* Recent Calls */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Calls
                </h2>
                <Link
                  href="/call-logs"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentCalls.length > 0 ? (
                  recentCalls.map((call, index) => (
                    <div
                      key={call.id || index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="bg-pink-100 rounded-full p-2">
                        <svg
                          className="w-4 h-4 text-pink-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {call.assistantId
                            ? `Assistant ${call.assistantId}`
                            : "Unknown Assistant"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {call.createdAt
                            ? new Date(call.createdAt).toLocaleDateString()
                            : "Recent call"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No calls yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
