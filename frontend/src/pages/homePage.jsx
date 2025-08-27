import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">⚡ EV Charging</h1>
          <nav className="space-x-6">
            <a href="#features" className="text-gray-700 hover:text-indigo-600">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-16">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-indigo-600">EV Charging Hub</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Find, book, and manage your EV charging slots with ease.  
          Fast. Reliable. Nearby.
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition"
          >
            Signup
          </a>
          <a
            href="/ports"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
          >
            Port Status
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">🔍 Find Stations</h3>
            <p className="text-gray-600">
              Easily locate EV charging stations nearby with real-time availability.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">⚡ Quick Booking</h3>
            <p className="text-gray-600">
              Reserve your charging port in advance and skip the waiting lines.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">📊 Track Usage</h3>
            <p className="text-gray-600">
              Get insights on your charging history, costs, and time saved.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p>
          © {new Date().getFullYear()} EV Charging Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
