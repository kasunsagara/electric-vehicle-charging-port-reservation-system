import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCarBattery, FaExclamationTriangle } from "react-icons/fa";
import Header from "../components/header";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <div className="pt-16 flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center">

            <div className="relative mb-8">
              <div className="text-9xl md:text-[200px] font-bold text-gray-800 opacity-10">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FaExclamationTriangle className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Page Not Found
                  </h1>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              The page you requested couldn't be located on our network.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link 
                to="/"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaHome className="w-5 h-5" />
                Back to Home
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}