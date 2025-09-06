import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBolt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between mt-2 mr-4 items-center px-6 py-4">
      <div className="flex items-center space-x-1">
        <FaBolt className="text-teal-700 text-xl" /> 
        <h1 className="text-xl font-semibold text-teal-700">ChargeNow</h1>
      </div>

      <div className="flex space-x-4 items-center relative">
        {!user ? (
          <>
            <Link
              to="/login"
              className="bg-teal-700 text-xl font-medium text-white px-4 py-2 rounded-md hover:bg-green-100 hover:text-teal-700 border-3 border-teal-700"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-teal-700 text-xl font-medium text-white px-4 py-2 rounded-md hover:bg-green-100 hover:text-teal-700 border-3 border-teal-700"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-teal-700 text-xl font-medium text-white px-4 py-2 rounded-md hover:bg-green-100 hover:text-teal-700 border-3 border-teal-700 flex items-center justify-between w-full group"
              >
                Profile
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <Link
                    to="/my-account"
                    className="block px-4 py-2 text-gray-800 font-bold hover:bg-teal-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 text-gray-800 font-bold hover:bg-teal-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Bookings
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="bg-teal-700 text-xl font-medium text-white px-4 py-2 rounded-md hover:bg-green-100 hover:text-teal-700 border-3 border-teal-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
