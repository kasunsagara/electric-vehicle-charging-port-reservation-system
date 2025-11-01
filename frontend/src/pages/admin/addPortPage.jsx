import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaChargingStation, FaMapMarkerAlt, FaPlus } from "react-icons/fa";

export default function AddPortPage() {
  const [portId, setPortId] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [normalSpeed, setNormalSpeed] = useState("");
  const [fastSpeed, setFastSpeed] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newPort = {
        portId,
        location,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
        chargerOptions: [
          { type: "normal", speed: parseFloat(normalSpeed) },
          { type: "fast", speed: parseFloat(fastSpeed) }
        ]
      };

      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/ports", newPort, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Port added successfully");
      navigate("/admin/ports");
    } catch (err) {
      console.error("Error adding port:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add port");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">       
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <FaPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Add New Port</h1>
              <p className="text-gray-600 mt-1">Create a new charging station in the system</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Port ID Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaChargingStation className="w-4 h-4 inline mr-2 text-green-600" />
                Port ID
              </label>
              <input
                type="text"
                value={portId}
                onChange={(e) => setPortId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                placeholder="Enter unique port identifier"
                required
              />
            </div>

            {/* Location Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaMapMarkerAlt className="w-4 h-4 inline mr-2 text-orange-500" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                placeholder="Enter port location address"
                required
              />
            </div>

            {/* Coordinates Section */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-500" />
                Coordinates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                    placeholder="e.g., 6.9271"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                    placeholder="e.g., 79.8612"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Charger Options Section */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaChargingStation className="w-4 h-4 mr-2 text-purple-500" />
                Charger Options
              </h3>
              
              {/* Normal Charger */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold mr-2">Normal</span>
                  Charger Speed (kW)
                </label>
                <input
                  type="number"
                  value={normalSpeed}
                  onChange={(e) => setNormalSpeed(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                  placeholder="e.g., 10"
                  required
                />
              </div>

              {/* Fast Charger */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold mr-2">Fast</span>
                  Charger Speed (kW)
                </label>
                <input
                  type="number"
                  value={fastSpeed}
                  onChange={(e) => setFastSpeed(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                  placeholder="e.g., 40"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding Port...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Add Charging Port
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}