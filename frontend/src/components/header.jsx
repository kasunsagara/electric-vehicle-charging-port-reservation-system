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
    <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <FaBolt className="text-2xl text-yellow-300 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-tight">ChargeNow</h1>
        </div>

        {/* Navigation Section */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link 
                to="/login" 
                className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-yellow-400 text-gray-800 hover:bg-yellow-300 px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg flex items-center space-x-1"
                >
                  <span>Profile</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
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
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg"
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