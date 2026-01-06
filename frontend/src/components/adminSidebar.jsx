import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserShield, FaTachometerAlt, FaChargingStation, FaUsers, FaCalendarCheck, FaComments, FaHome, FaSignOutAlt } from "react-icons/fa";

export default function AdminSidebar() {
  const [activeTab, setActiveTab] = useState("adminHome");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  const linkBase =
    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200";
  const activeStyle =
    "bg-white text-green-700 shadow-lg transform scale-105";
  const normalStyle =
    "text-green-100 hover:bg-green-500 hover:text-white hover:shadow-md";

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-green-600 to-emerald-700 flex flex-col shadow-xl border-r border-green-500">

      <div className="p-6 border-b border-green-500">
        <h2 className="text-white text-xl font-bold">Admin Panel</h2>
      </div>

      <nav className="flex-1 flex flex-col p-4 space-y-2">

        <Link
          to="/admin"
          onClick={() => setActiveTab("adminHome")}
          className={`${linkBase} ${
            activeTab === "adminHome" ? activeStyle : normalStyle
          }`}
        >
          <FaUserShield className={`w-5 h-5 ${activeTab === "adminHome" ? "text-green-600" : ""}`} />
          <span className="font-semibold">Admin Home</span>
        </Link>

        <Link
          to="/admin/dashboard"
          onClick={() => setActiveTab("dashboard")}
          className={`${linkBase} ${
            activeTab === "dashboard" ? activeStyle : normalStyle
          }`}
        >
          <FaTachometerAlt className={`w-5 h-5 ${activeTab === "dashboard" ? "text-green-600" : ""}`} />
          <span className="font-semibold">Dashboard</span>
        </Link>

        <Link
          to="/admin/ports"
          onClick={() => setActiveTab("ports")}
          className={`${linkBase} ${
            activeTab === "ports" ? activeStyle : normalStyle
          }`}
        >
          <FaChargingStation className={`w-5 h-5 ${activeTab === "ports" ? "text-green-600" : ""}`} />
          <span className="font-semibold">Ports</span>
        </Link>

        <Link
          to="/admin/users"
          onClick={() => setActiveTab("users")}
          className={`${linkBase} ${
            activeTab === "users" ? activeStyle : normalStyle
          }`}
        >
          <FaUsers className={`w-5 h-5 ${activeTab === "users" ? "text-green-600" : ""}`} />
          <span className="font-semibold">Users</span>
        </Link>

        <Link
          to="/admin/bookings"
          onClick={() => setActiveTab("bookings")}
          className={`${linkBase} ${
            activeTab === "bookings" ? activeStyle : normalStyle
          }`}
        >
          <FaCalendarCheck className={`w-5 h-5 ${activeTab === "bookings" ? "text-green-600" : ""}`} />
          <span className="font-semibold">Bookings</span>
        </Link>

        <Link
          to="/admin/feedbacks"
          onClick={() => setActiveTab("feedbacks")}
          className={`${linkBase} ${
            activeTab === "feedbacks" ? activeStyle : normalStyle
          }`}
        >
          <FaComments className={`w-5 h-5 ${activeTab === "feedbacks" ? "text-green-600" : ""}`} />
          <span className="font-semibold">Feedbacks</span>
        </Link>

        <Link
          to="/"
          onClick={() => setActiveTab("home")}
          className={`${linkBase} ${
            activeTab === "home" ? activeStyle : normalStyle
          }`}
        >
          <FaHome className={`w-5 h-5 ${activeTab === "home" ? "text-green-600" : ""}`} />
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
  );
}
