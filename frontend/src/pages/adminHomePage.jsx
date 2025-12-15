import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaUserShield, FaTachometerAlt, FaChargingStation, FaUsers, FaCalendarCheck, FaComments, FaHome, FaSignOutAlt } from "react-icons/fa";
import AdminDashboardPage from "./admin/adminDashboardPage";
import AdminPortsPage from "./admin/adminPortsPage";
import AddPortPage from "./admin/addPortPage";
import UpdatePortPage from "./admin/updatePortPage";
import AdminUsersPage from "./admin/adminUserPage";
import AddAdminPage from "./admin/addAdminPage";
import AdminBookingsPage from "./admin/adminBookingsPage";
import AdminFeedbackPage from "./admin/adminFeedbackPage";

export default function AdminHomePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(" ");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="w-full h-screen flex font-sans bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-64 h-screen bg-gradient-to-b from-green-600 to-emerald-700 flex flex-col shadow-xl border-r border-green-500">
        <div className="p-6 border-b border-green-500">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-white text-xl font-bold">Admin Panel</h2>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col p-4 space-y-2">
          <Link
            to="/admin"
            onClick={() => setActiveTab("adminHome")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "adminHome"
                ? "bg-white text-green-700 shadow-lg transform scale-105"
                : "text-green-100 hover:bg-green-500 hover:text-white hover:shadow-md"
            }`}
          >
            <FaUserShield className={`w-5 h-5 ${activeTab === "adminHome" ? 'text-green-600' : ''}`} />
            <span className="font-semibold">Admin Home</span>
          </Link>

          <Link
            to="/admin/dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-white text-green-700 shadow-lg transform scale-105"
                : "text-green-100 hover:bg-green-500 hover:text-white hover:shadow-md"
            }`}
          >
            <FaTachometerAlt className={`w-5 h-5 ${activeTab === "dashboard" ? 'text-green-600' : ''}`} />
            <span className="font-semibold">Dashboard</span>
          </Link>

          <Link
            to="/admin/ports"
            onClick={() => setActiveTab("ports")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "ports"
                ? "bg-white text-green-700 shadow-lg transform scale-105"
                : "text-green-100 hover:bg-green-500 hover:text-white hover:shadow-md"
            }`}
          >
            <FaChargingStation className={`w-5 h-5 ${activeTab === "ports" ? 'text-green-600' : ''}`} />
            <span className="font-semibold">Ports</span>
          </Link>

          <Link
            to="/admin/users"
            onClick={() => setActiveTab("users")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "users"
                ? "bg-white text-green-700 shadow-lg transform scale-105"
                : "text-green-100 hover:bg-green-500 hover:text-white hover:shadow-md"
            }`}
          >
            <FaUsers className={`w-5 h-5 ${activeTab === "users" ? 'text-green-600' : ''}`} />
            <span className="font-semibold">Users</span>
          </Link>

          <Link
            to="/admin/bookings"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "bookings"
                ? "bg-white text-green-700 shadow-lg transform scale-105"
                : "text-green-100 hover:bg-green-500 hover:text-white hover:shadow-md"
            }`}
          >
            <FaCalendarCheck className={`w-5 h-5 ${activeTab === "bookings" ? 'text-green-600' : ''}`} />
            <span className="font-semibold">Bookings</span>
          </Link>

          <Link
            to="/admin/feedbacks"
            onClick={() => setActiveTab("feedbacks")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "feedbacks"
                ? "bg-white text-green-700 shadow-lg transform scale-105"
                : "text-green-100 hover:bg-green-500 hover:text-white hover:shadow-md"
            }`}
          >
            <FaComments className={`w-5 h-5 ${activeTab === "feedbacks" ? 'text-green-600' : ''}`} />
            <span className="font-semibold">Feedbacks</span>
          </Link>

          <Link
            to="/"
            onClick={() => setActiveTab("home")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === "home"
                ? "bg-white text-green-700 shadow-lg transform scale-105"
                : "text-green-100 hover:bg-green-500 hover:text-white hover:shadow-md"
            }`}
          >
            <FaHome className={`w-5 h-5 ${activeTab === "home" ? 'text-green-600' : ''}`} />
            <span className="font-semibold">Home</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-green-500">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-green-100 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 font-semibold hover:shadow-md"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 h-screen overflow-hidden flex flex-col">

        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-100 p-6">
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FaChargingStation className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                      Welcome, {user ? user.name || user.username || "Admin" : "Admin"}!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2x">
                      This is your admin dashboard where you can manage ports, users, and view comprehensive reports for the ChargeNow EV charging system.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <FaChargingStation className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Port Management</h3>
                        <p className="text-gray-600 text-sm">Manage charging stations and availability</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <FaUsers className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">User Management</h3>
                        <p className="text-gray-600 text-sm">View and manage system users</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <FaCalendarCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Booking Reports</h3>
                        <p className="text-gray-600 text-sm">Monitor all charging sessions</p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            <Route path="/ports" element={<AdminPortsPage />} />
            <Route path="/ports/addPort" element={<AddPortPage />} />
            <Route path="/ports/updatePort" element={<UpdatePortPage />} />
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/users/addAdmin" element={<AddAdminPage />} />                      
            <Route path="/bookings" element={<AdminBookingsPage />} />
            <Route path="/feedbacks" element={<AdminFeedbackPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}