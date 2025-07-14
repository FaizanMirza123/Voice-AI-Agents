"use client";
import { useEffect, useState } from "react";
import { apiService } from "@/services/apiService";
import ProtectedRoute from "@/components/ProtectedRoute";
import AssistantCard from "@/components/AssistantCard";
import AssistantModal from "@/components/AssistantModal";
import { toast } from "react-hot-toast";

export default function AssistantsPage() {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const data = await apiService.getAssistants();
      setAssistants(data);
    } catch (error) {
      toast.error("Failed to load assistants");
    } finally {
      setLoading(false);
    }
  };

  const handleAssistantSave = (newAssistant) => {
    setAssistants((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === newAssistant.id);
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = newAssistant;
        return updated;
      } else {
        // Add new
        return [...prev, newAssistant];
      }
    });
  };

  const handleAssistantDelete = (assistantId) => {
    setAssistants((prev) => prev.filter((a) => a.id !== assistantId));
  };

  const filteredAssistants = assistants.filter((assistant) =>
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8 fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 slide-in-up">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Voice Assistants
              </h1>
              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
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
                <span>Create Assistant</span>
              </button>
            </div>
            <p className="text-gray-600">
              Manage your AI-powered voice assistants
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 slide-in-left">
            <div className="relative max-w-md">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search assistants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Assistants Grid */}
          {filteredAssistants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 slide-in-up">
              {filteredAssistants.map((assistant, index) => (
                <div
                  key={assistant.id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <AssistantCard
                    assistant={assistant}
                    onUpdate={handleAssistantSave}
                    onDelete={handleAssistantDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 fade-in">
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
                {searchTerm ? "No assistants found" : "No assistants yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first voice assistant to get started"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Create Your First Assistant
                </button>
              )}
            </div>
          )}

          {/* Statistics */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 card-hover slide-in-right">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-purple-600">
                  {assistants.length}
                </div>
                <div className="text-sm text-gray-600">Total Assistants</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-pink-600">
                  {assistants.filter((a) => a.voice?.voiceId).length}
                </div>
                <div className="text-sm text-gray-600">With Voice Config</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-green-600">
                  {assistants.filter((a) => a.firstMessage).length}
                </div>
                <div className="text-sm text-gray-600">With First Message</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AssistantModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAssistantSave}
      />
    </ProtectedRoute>
  );
}
