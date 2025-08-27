import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between mt-2 mr-4 items-center px-6 py-4">
        {/* Logo + Name */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full border-2 border-teal-600 flex items-center justify-center">
            <span className="text-teal-600 font-bold">⚡</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">
            ChargeNow
          </h1>
        </div>

        {/* Right buttons */}
        <div className="flex space-x-6">
          <Link
            to="/login"
            className="text-teal-700 text-xl font-medium border-3 border-teal-700 px-4 py-2 rounded-md hover:bg-teal-700 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-teal-700 text-xl font-medium text-white px-4 py-2 rounded-md hover:bg-green-100 hover:text-teal-700 border-3 border-teal-700"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-[42px] font-bold text-teal-800 mb-4">
          Electric Vehicle Charging Port Reservation System
        </h2>
        <p className="text-gray-600 text-[17px] max-w-xl mb-6">
          The future of electric vehicle charging is here. Easily find, book,
          and manage your EV charging sessions.
        </p>
        <Link
          to="/port-status"
          className="bg-teal-700 text-xl font-medium text-white px-4 py-2 rounded-md hover:bg-green-100 hover:text-teal-700 border-3 border-teal-700"
        >
          Check Ports
        </Link>
      </main>
    </div>
  );
}
