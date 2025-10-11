import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiShield, FiEdit, FiHome, FiList } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function MyAccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        // Get email dynamically from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.email) {
          toast.error("User not logged in");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/users/me?email=${storedUser.email}`
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

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'customer':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '👑';
      case 'customer':
        return '👤';
      default:
        return '👤';
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
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <FiUser className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">My Account</h1>
              <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition duration-200">
                  <FiEdit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Name Field */}
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiMail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiPhone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <p className="text-lg font-semibold text-gray-800">{user.phone}</p>
                  </div>
                </div>

                {/* Role Field */}
                <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Account Role</label>
                    <div className="flex items-center space-x-3">
                      <p className="text-lg font-semibold text-gray-800 capitalize">{user.role}</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FiShield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-gray-800 font-medium">2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-gray-800 font-medium">Recently</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/myBookings')}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100 transition duration-200 border border-green-200"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiList className="w-4 h-4" />
                  </div>
                  <span>View My Bookings</span>
                </button>
                
                <button 
                  onClick={() => navigate('/port-status')}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition duration-200 border border-blue-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiHome className="w-4 h-4" />
                  </div>
                  <span>Find Charging Ports</span>
                </button>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-bold text-gray-800">12</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-bold text-green-600">1</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Ports Used</span>
                  <span className="font-bold text-blue-600">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}