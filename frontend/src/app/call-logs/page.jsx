"use client";
import { useEffect, useState } from "react";
import { apiService } from "@/services/apiService";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";

export default function CallLogsPage() {
  const [messagesByAssistant, setMessagesByAssistant] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const fetchCallLogs = async () => {
    try {
      const data = await apiService.getMessages();
      setMessagesByAssistant(data);
    } catch (error) {
      toast.error("Failed to load call logs");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown time";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "user":
        return "bg-blue-100 text-blue-800";
      case "assistant":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Call Logs</h1>
            <p className="text-gray-600">
              View and analyze your voice assistant conversations
            </p>
          </div>

          {Object.keys(messagesByAssistant).length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Assistant List */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Assistants
                  </h2>
                  <div className="space-y-2">
                    {Object.entries(messagesByAssistant).map(
                      ([assistantName, chats]) => (
                        <button
                          key={assistantName}
                          onClick={() => {
                            setSelectedAssistant(assistantName);
                            setSelectedChatIndex(null);
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedAssistant === assistantName
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="font-medium">{assistantName}</div>
                          <div className="text-sm text-gray-500">
                            {chats.length} conversation
                            {chats.length !== 1 ? "s" : ""}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Conversation List */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {selectedAssistant
                      ? `${selectedAssistant} Conversations`
                      : "Select an Assistant"}
                  </h2>
                  {selectedAssistant ? (
                    <div className="space-y-2">
                      {messagesByAssistant[selectedAssistant].map(
                        (chat, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedChatIndex(index)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              selectedChatIndex === index
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <div className="font-medium">
                              Conversation {index + 1}
                            </div>
                            <div className="text-sm text-gray-500">
                              {chat.length} message
                              {chat.length !== 1 ? "s" : ""}
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Select an assistant to view conversations
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {selectedAssistant && selectedChatIndex !== null
                      ? `Messages - Conversation ${selectedChatIndex + 1}`
                      : "Select a Conversation"}
                  </h2>
                  {selectedAssistant && selectedChatIndex !== null ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {messagesByAssistant[selectedAssistant][
                        selectedChatIndex
                      ].map((message, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-gray-200 pl-4"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                                message.role
                              )}`}
                            >
                              {message.role}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(message.time)}
                            </span>
                          </div>
                          <p className="text-gray-800">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Select a conversation to view messages
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No call logs yet
              </h3>
              <p className="text-gray-500 mb-4">
                Once your assistants start receiving calls, conversation logs
                will appear here
              </p>
            </div>
          )}

          {/* Summary Statistics */}
          {Object.keys(messagesByAssistant).length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Call Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {Object.keys(messagesByAssistant).length}
                  </div>
                  <div className="text-sm text-gray-500">Active Assistants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">
                    {Object.values(messagesByAssistant).reduce(
                      (total, chats) => total + chats.length,
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total Conversations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Object.values(messagesByAssistant).reduce(
                      (total, chats) =>
                        total +
                        chats.reduce(
                          (chatTotal, chat) => chatTotal + chat.length,
                          0
                        ),
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Total Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Object.values(messagesByAssistant).reduce(
                      (total, chats) =>
                        total +
                        chats.reduce(
                          (chatTotal, chat) =>
                            chatTotal +
                            chat.filter((msg) => msg.role === "user").length,
                          0
                        ),
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-500">User Messages</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
