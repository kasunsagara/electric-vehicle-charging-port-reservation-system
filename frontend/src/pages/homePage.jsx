import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaShieldAlt, FaClock, FaStar, FaQuoteLeft, FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Header from "../components/header";
import axios from "axios";

export default function HomePage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/feedbacks");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Next slide function
  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === feedbacks.length - 1 ? 0 : prev + 1
    );
  };

  // Previous slide function
  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? feedbacks.length - 1 : prev - 1
    );
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    if (feedbacks.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [feedbacks.length]);

  // Function to go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      {/* Navbar - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Add padding top to account for fixed header */}
      <div className="pt-16"> {/* Adjust this value based on your header height */}
        
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

        {/* Customer Feedback Section - Slideshow */}
        <div className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hear from EV owners who have experienced our charging services
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : feedbacks.length > 0 ? (
              <div className="relative">
                {/* Slideshow Container */}
                <div className="relative overflow-hidden rounded-2xl bg-white border border-green-100 shadow-xl">
                  {/* Slides */}
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {feedbacks.map((feedback, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 px-8 py-12 md:px-16 md:py-16"
                      >
                        <div className="max-w-2xl mx-auto text-center">
                          {/* Quote Icon */}
                          <FaQuoteLeft className="w-8 h-8 text-green-400 opacity-50 mx-auto mb-6" />
                          
                          {/* Feedback Message */}
                          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                            "{feedback.message}"
                          </p>

                          {/* Customer Info */}
                          <div className="flex items-center justify-center">
                            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                              <FaUser className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-lg font-semibold text-gray-800">{feedback.name}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {feedbacks.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-green-50 transition duration-200 group"
                      >
                        <FaChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-green-50 transition duration-200 group"
                      >
                        <FaChevronRight className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                      </button>
                    </>
                  )}
                </div>

                {/* Dots Indicator */}
                {feedbacks.length > 1 && (
                  <div className="flex justify-center mt-8 space-x-3">
                    {feedbacks.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition duration-300 ${
                          index === currentSlide 
                            ? 'bg-green-500 scale-125' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Feedback Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Be the first to share your experience with our charging services
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-xl font-semibold transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Share Your Feedback
                </Link>
              </div>
            )}

            {/* Share Your Experience Button */}
            {feedbacks.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-xl font-semibold transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Share Your Experience
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section - Simple */}
        <footer className="bg-gradient-to-r from-green-800 to-emerald-900 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-green-200">
              © 2024 ChargeNow. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}            