"use client";
import { useState } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from 'react-hot-toast';

const AssistantModal = ({ isOpen, onClose, assistant = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: assistant?.name || '',
    prompt: assistant?.prompt || '',
    voiceId: assistant?.voice?.voiceId || '21m00Tcm4TlvDq8ikWAM',
    firstMessage: assistant?.firstMessage || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      if (assistant) {
        result = await apiService.updateAssistant(assistant.id, formData);
        toast.success('Assistant updated successfully!');
      } else {
        result = await apiService.createAssistant(formData);
        toast.success('Assistant created successfully!');
      }
      
      onSave(result);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 hover:scale-105 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {assistant ? 'Edit Assistant' : 'Create Assistant'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl transition-colors duration-200 hover:scale-110"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="slide-in-up">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
            />
          </div>
          
          <div className="slide-in-up" style={{ animationDelay: '100ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Prompt
            </label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
              placeholder="You are a helpful assistant..."
            />
          </div>
          
          <div className="slide-in-up" style={{ animationDelay: '200ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voice ID
            </label>
            <input
              type="text"
              name="voiceId"
              value={formData.voiceId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
              placeholder="21m00Tcm4TlvDq8ikWAM"
            />
          </div>
          
          <div className="slide-in-up" style={{ animationDelay: '300ms' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Message (Optional)
            </label>
            <input
              type="text"
              name="firstMessage"
              value={formData.firstMessage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
              placeholder="Hello! How can I help you today?"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 slide-in-up" style={{ animationDelay: '400ms' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              {loading ? 'Saving...' : (assistant ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantModal;
