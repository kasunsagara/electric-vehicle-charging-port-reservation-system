import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { FaUserShield, FaUser, FaUserTie, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export default function MyAccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.email) {
          toast.error("User not logged in");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me?email=${storedUser.email}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setUser(res.data.user);
      } catch (error) {
        console.error("AxiosError", error);
        toast.error(
          error.response?.data?.message || "Failed to load account details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <FaUserShield className="text-red-600" />;
      case 'customer':
        return <FaUser className="text-red-600" />;
      default:
        return <FaUserTie className="text-red-600" />;
    }
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Account deleted successfully");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/signup");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your account details...</p>
        </div>
      </div>
    );

  if (!user) 
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No User Data Available</h3>
          <p className="text-gray-600 mb-6">Please log in to view your account details.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <FiUser className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">My Account</h1>
              <p className="text-gray-600 mt-2">View your profile Information</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8 space-y-6">

              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiMail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiPhone className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <p className="text-lg font-semibold text-gray-800">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                  {getRoleIcon(user.role)}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Account Role</label>
                  <p className="text-lg font-semibold text-gray-800 capitalize">{user.role}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/updateAccount")}
                  className="px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 group"
                >
                  <FaEdit className="w-4 h-4 transition-transform" />
                  <span>Update Account</span>
                </button>

                <button
                  onClick={deleteAccount}
                  className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 group"
                >
                  <FaTrashAlt className="w-4 h-4 transition-transform" />
                  <span>Delete Account</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}