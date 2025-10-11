import React from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaShieldAlt, FaClock } from 'react-icons/fa';
import Header from "../components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Electric Vehicle Charging Port 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 block">
              Reservation System
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            The future of electric vehicle charging is here with the ability to easily find, 
            book, and manage your EV charging sessions. Fast, reliable, and eco-friendly.
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/port-status" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Check Available Ports
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FaBolt className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Charging</h3>
              <p className="text-gray-600">High-speed charging ports for quick power-ups</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FaShieldAlt className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Booking</h3>
              <p className="text-gray-600">Guaranteed slots with real-time availability</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FaClock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Access</h3>
              <p className="text-gray-600">Round-the-clock service for your convenience</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}