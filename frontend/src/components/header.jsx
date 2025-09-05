import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBolt, FaChevronDown } from "react-icons/fa"; 
import { toast } from "react-hot-toast";

export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully ✅");
    navigate("/login");
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
      {/* Logo */}
      <div className="flex items-center space-x-1">
        <FaBolt className="text-teal-700 text-xl" /> 
        <h1 className="text-xl font-semibold text-teal-700">ChargeNow</h1>
      </div>

      {/* Right buttons */}
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
            {/* Profile button with dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-teal-700 text-xl font-medium text-white px-4 py-2 rounded-md hover:bg-green-100 hover:text-teal-700 border-3 border-teal-700 flex items-center justify-between w-full group"
              >
                Profile
                {/* Chevron shows only on hover */}
                <FaChevronDown className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                    to="/bookings"
                    className="block px-4 py-2 text-gray-800 font-bold hover:bg-teal-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Bookings
                  </Link>
                </div>
              )}
            </div>

            {/* Logout button */}
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
