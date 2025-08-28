import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      {/* Navbar */}
      <Header /> 

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-[42px] font-bold text-teal-700 mb-4">
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
