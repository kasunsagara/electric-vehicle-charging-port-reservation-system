import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import AdminPortsPage from "./admin/adminPortsPage";
import AddPortPage from "./admin/addPortPage";
import AdminBookingsPage from "./admin/adminBookingsPage";

export default function AdminHomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully ✅");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="w-full h-screen flex font-sans">
      {/* Sidebar */}
      <div className="w-[20%] h-screen bg-green-600 flex flex-col shadow-lg">
        <h2 className="text-white text-[24px] font-bold p-6">Admin Panel</h2>
        <nav className="flex flex-col h-full text-[17px]">
          <Link
            to="/admin/dashboard"
            className="text-white px-6 py-3 hover:bg-green-700 transition rounded-r-full"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/ports"
            className="text-white px-6 py-3 hover:bg-green-700 transition rounded-r-full"
          >
            Ports
          </Link>

          <Link
            to="/admin/bookings"
            className="text-white px-6 py-3 hover:bg-green-700 transition rounded-r-full"
          >
            Bookings
          </Link>

          <Link
            to="/admin/users"
            className="text-white px-6 py-3 hover:bg-green-700 transition rounded-r-full"
          >
            Users
          </Link>

          <Link
            to="/"
            className="text-white px-6 py-3 hover:bg-green-700 transition rounded-r-full"
          >
            Home
          </Link>

          {/* Logout button at bottom */}
          <button
            onClick={handleLogout}
            className="text-white px-6 py-3 hover:bg-green-700 transition rounded-r-full text-left"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-[80%] h-screen bg-green-100 p-8 overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-4xl mx-auto flex flex-col items-center mt-20">
                <h1 className="text-[54px] font-bold text-teal-700 mb-6">
                  Welcome, Admin!
                </h1>
                <p className="text-[18px] text-gray-600">
                  This is your admin dashboard where you can manage users, view
                  reports, and configure system settings.
                </p>
              </div>
            }
          />
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/ports" element={<AdminPortsPage />} />
          <Route path="/ports/addPort" element={<AddPortPage />} />
          <Route path="/bookings" element={<AdminBookingsPage />} />
          <Route path="/users" element={<h1>Users</h1>} />
        </Routes>
      </div>
    </div>
  );
}
