import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
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
  );
}
