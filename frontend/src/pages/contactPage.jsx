import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaComments, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaHeadset } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    message: ""
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const messageRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting feedback:", formData);

      const response = await axios.post(import.meta.env.BACKEND_URL + "/api/feedbacks", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      
      toast.success("Thank you for your feedback! We appreciate your input.");
      setMessages([...messages, formData]);
      setFormData({ 
        name: "", 
        message: ""
      });
      
      // Navigate to home page after successful submission
      navigate("/");
      
    } catch (error) {
      console.error("Error details:", error);
      
      if (error.response) {
        // Server responded with error status
        console.error("Server error:", error.response.data);
        toast.error(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        // Other errors
        console.error("Error:", error.message);
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <FaHeadset className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help you with any questions about our EV charging services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FaComments className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Reach Out to Us</h2>
            </div>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaPhoneAlt className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-800">0771670585</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaEnvelope className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="text-lg font-semibold text-gray-800">kasunsagara689@gmail.com</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FaMapMarkerAlt className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Our Location</p>
                  <p className="text-lg font-semibold text-gray-800">74 A, Ridivita, Hiramadagama, Kahawaththa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FaPaperPlane className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Share Your Experience</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, messageRef)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Feedback
                </label>
                <textarea
                  ref={messageRef}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share your feedback on our EV charging services..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400 resize-none"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting Feedback...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Submit Feedback
                  </div>
                )}
              </button>
            </form>

            {/* Recent Messages Preview */}
            {messages.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Recent Messages</h4>
                <div className="space-y-2">
                  {messages.slice(-3).map((msg, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-white p-2 rounded-lg border">
                      <span className="font-medium">{msg.name}:</span> {msg.message.substring(0, 50)}...
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}