"use client";
import { useState } from 'react';
import { apiService } from '@/services/apiService';
import { toast } from 'react-hot-toast';
import AssistantModal from './AssistantModal';

const AssistantCard = ({ assistant, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await apiService.deleteAssistant(assistant.id);
      toast.success('Assistant deleted successfully');
      onDelete(assistant.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete assistant');
    }
  };

  const handleSave = (updatedAssistant) => {
    onUpdate(updatedAssistant);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{assistant.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Voice ID:</span> {assistant.voice?.voiceId || 'N/A'}
          </div>
          {assistant.firstMessage && (
            <div>
              <span className="font-medium">First Message:</span> {assistant.firstMessage}
            </div>
          )}
          <div>
            <span className="font-medium">Created:</span> {
              assistant.createdAt ? new Date(assistant.createdAt).toLocaleDateString() : 'N/A'
            }
          </div>
        </div>
        
        {assistant.model?.messages?.[0]?.content && (
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <span className="font-medium text-sm">System Prompt:</span>
            <p className="text-sm text-gray-700 mt-1 line-clamp-3">
              {assistant.model.messages[0].content}
            </p>
          </div>
        )}
      </div>

      <AssistantModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        assistant={assistant}
        onSave={handleSave}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">Delete Assistant</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{assistant.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantCard;
