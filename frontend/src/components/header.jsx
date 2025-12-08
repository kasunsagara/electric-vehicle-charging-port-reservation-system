import { useEffect, useState, useRef } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { FaBolt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaChevronDown } from 'react-icons/fa';

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
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

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
    <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <FaBolt className="text-2xl text-yellow-300" />
          <h1 className="text-white text-2xl font-bold tracking-tight">ChargeNow</h1>
        </div>

        {/* Navigation Section */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/contact" 
                className="text-white text-lg font-semibold px-4 py-1 rounded-xl
                          bg-white/20 backdrop-blur-md shadow-sm
                          hover:bg-green-500
                          transition-all duration-300 
                          hover:shadow-lg hover:shadow-white/10
                          hover:-translate-y-0.5"
              >
                Contact
              </Link>
              <Link 
                to="/login" 
                className="text-white text-lg font-semibold px-4 py-1 rounded-xl
                          bg-white/20 backdrop-blur-md shadow-sm
                          hover:bg-green-500
                          transition-all duration-300 
                          hover:shadow-lg hover:shadow-white/10
                          hover:-translate-y-0.5"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-white text-lg font-semibold px-4 py-1 rounded-xl
                          bg-white/20 backdrop-blur-md shadow-sm
                          hover:bg-green-500
                          transition-all duration-300 
                          hover:shadow-lg hover:shadow-white/10
                          hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Contact Link for logged in users */}
              <Link 
                to="/contact" 
                className="text-white text-lg font-semibold px-4 py-1 rounded-xl
                          bg-white/20 backdrop-blur-md shadow-sm
                          hover:bg-green-500
                          transition-all duration-300 
                          hover:shadow-lg hover:shadow-white/10
                          hover:-translate-y-0.5"
              >
                Contact
              </Link>

              {/* Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-white text-lg font-semibold px-4 py-1 rounded-xl
                          bg-white/20 backdrop-blur-md shadow-sm
                          hover:bg-green-500
                          transition-all duration-300 
                          hover:shadow-lg hover:shadow-white/10
                          hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <span>Profile</span>
                    <FaChevronDown 
                      className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                    <Link 
                      to="/myAccount" 
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition duration-150 border-b border-gray-100"
                    >
                      My Account
                    </Link>
                    <Link 
                      to="/myBookings" 
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition duration-150"
                    >
                      My Bookings
                    </Link>
                  </div>
                )}
              </div>

              <button 
                onClick={handleLogout}
                className="text-white text-lg font-semibold px-4 py-1 rounded-xl
                          bg-white/20 backdrop-blur-md shadow-sm
                          hover:bg-red-500
                          transition-all duration-300 
                          hover:shadow-lg hover:shadow-white/10
                          hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}