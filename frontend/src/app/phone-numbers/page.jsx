"use client";
import { useEffect, useState } from "react";
import { apiService } from "@/services/apiService";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);
  const [formData, setFormData] = useState({
    number: "",
    provider: "byo-phone-number",
    credentialId: "",
  });

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const fetchPhoneNumbers = async () => {
    try {
      const data = await apiService.getPhoneNumbers();
      setPhoneNumbers(data);
    } catch (error) {
      toast.error("Failed to load phone numbers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPhone) {
        const updated = await apiService.updatePhoneNumber(
          editingPhone.id,
          formData
        );
        setPhoneNumbers((prev) =>
          prev.map((p) => (p.id === editingPhone.id ? updated : p))
        );
        toast.success("Phone number updated successfully");
      } else {
        const created = await apiService.createPhoneNumber(formData);
        setPhoneNumbers((prev) => [...prev, created]);
        toast.success("Phone number created successfully");
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this phone number?")) {
      try {
        await apiService.deletePhoneNumber(id);
        setPhoneNumbers((prev) => prev.filter((p) => p.id !== id));
        toast.success("Phone number deleted successfully");
      } catch (error) {
        toast.error("Failed to delete phone number");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      number: "",
      provider: "byo-phone-number",
      credentialId: "",
    });
    setEditingPhone(null);
    setShowModal(false);
  };

  const startEdit = (phone) => {
    setEditingPhone(phone);
    setFormData({
      number: phone.number || "",
      provider: phone.provider || "byo-phone-number",
      credentialId: phone.credentialId || "",
    });
    setShowModal(true);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8 fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 slide-in-up">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Phone Numbers
              </h1>
              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center space-x-2 hover:scale-105 hover:shadow-lg"
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
                <span>Add Phone Number</span>
              </button>
            </div>
            <p className="text-gray-600">
              Manage phone numbers for your voice assistants
            </p>
          </div>

          {phoneNumbers.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 slide-in-up"
              style={{ animationDelay: "100ms" }}
            >
              {phoneNumbers.map((phone, index) => (
                <div
                  key={phone.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {phone.number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Provider: {phone.provider}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(phone)}
                        className="text-blue-500 hover:text-blue-700 text-sm transition-colors duration-200 hover:scale-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(phone.id)}
                        className="text-red-500 hover:text-red-700 text-sm transition-colors duration-200 hover:scale-110"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {phone.credentialId && (
                      <div>
                        <span className="font-medium">Credential ID:</span>{" "}
                        {phone.credentialId}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {phone.createdAt
                        ? new Date(phone.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-12 slide-in-up"
              style={{ animationDelay: "200ms" }}
            >
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
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No phone numbers yet
              </h3>
              <p className="text-gray-500 mb-4">
                Add a phone number to enable voice calls for your assistants
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Add Your First Phone Number
              </button>
            </div>
          )}

          {/* Statistics */}
          <div
            className="mt-8 bg-white rounded-lg shadow-md p-6 slide-in-up hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
            style={{ animationDelay: "300ms" }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {phoneNumbers.length}
                </div>
                <div className="text-sm text-gray-500">Total Numbers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">
                  {
                    phoneNumbers.filter(
                      (p) => p.provider === "byo-phone-number"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-500">BYO Numbers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {phoneNumbers.filter((p) => p.credentialId).length}
                </div>
                <div className="text-sm text-gray-500">With Credentials</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 hover:scale-105 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingPhone ? "Edit Phone Number" : "Add Phone Number"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 text-xl transition-colors duration-200 hover:scale-110"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="slide-in-up">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                  placeholder="+1234567890"
                />
              </div>

              <div className="slide-in-up" style={{ animationDelay: "100ms" }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 transition-all duration-200"
                >
                  <option value="byo-phone-number">BYO Phone Number</option>
                  <option value="twilio">Twilio</option>
                  <option value="vonage">Vonage</option>
                </select>
              </div>

              <div className="slide-in-up" style={{ animationDelay: "200ms" }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.credentialId}
                  onChange={(e) =>
                    setFormData({ ...formData, credentialId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                  placeholder="credential-id"
                />
              </div>

              <div
                className="flex justify-end space-x-2 pt-4 slide-in-up"
                style={{ animationDelay: "300ms" }}
              >
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  {editingPhone ? "Update" : "Add"} Phone Number
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
