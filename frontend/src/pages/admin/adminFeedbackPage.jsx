import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaUser, FaComments } from "react-icons/fa";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(import.meta.env.BACKEND_URL + "/api/feedbacks");
      
      console.log("Fetched feedbacks:", response.data);
      
      const feedbacksData = Array.isArray(response.data) ? response.data : [];
      setFeedbacks(feedbacksData);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to load feedbacks.");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (feedbackId) => {
    try {
      setDeletingId(feedbackId);
      
      // Delete by ID only
      await axios.delete(import.meta.env.BACKEND_URL + `/api/feedbacks/${feedbackId}`);
      
      toast.success("Feedback deleted successfully");
      
      // Remove from state
      setFeedbacks(feedbacks.filter((fb) => {
        return fb._id !== feedbackId && fb.id !== feedbackId;
      }));
      
    } catch (error) {
      console.error("Error deleting feedback:", error);
      
      if (error.response) {
        toast.error(error.response.data.message || "Failed to delete feedback");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Safe array check for rendering
  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];
  const feedbacksCount = safeFeedbacks.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <FaComments className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Customer Feedback</h1>
                <p className="text-gray-600 mt-1">Manage and review customer feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Table */}
        {feedbacksCount === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaComments className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Feedback Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              There are no customer feedback submissions at the moment. Check back later to review customer experiences.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-500 to-emerald-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-4 text-center text-white font-semibold text-sm uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {safeFeedbacks.map((fb, index) => (
                    <tr 
                      key={fb._id || fb.id || index} 
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                            <FaUser className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{fb.name || 'Anonymous'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaComments className="w-3 h-3 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-700 max-w-md line-clamp-2">{fb.message || 'No message'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => deleteFeedback(fb._id || fb.id)}
                          disabled={deletingId === (fb._id || fb.id)}
                          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {deletingId === (fb._id || fb.id) ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FaTrash className="w-3 h-3" />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}