import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

export default function AddAdminPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users",
        { name, email, password, phone, role: "admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      navigate("/admin/users");
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">   
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <FaUserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Add New Admin</h1>
              <p className="text-gray-600 mt-1">Create a new administrator account for the system</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaUser className="w-4 h-4 inline mr-2 text-blue-600" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                placeholder="Enter admin's full name"
                required
              />
            </div>

            {/* Email Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaEnvelope className="w-4 h-4 inline mr-2 text-orange-500" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                placeholder="Enter admin's email address"
                required
              />
            </div>

            {/* Password Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaLock className="w-4 h-4 inline mr-2 text-red-500" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                placeholder="Create a secure password"
                required
              />
            </div>

            {/* Phone Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaPhone className="w-4 h-4 inline mr-2 text-green-500" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                placeholder="Enter phone number"
                required
              />
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
                  Creating Admin Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Create Admin Account
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}