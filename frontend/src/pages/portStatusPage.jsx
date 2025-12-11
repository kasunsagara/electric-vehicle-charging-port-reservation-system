import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiList, FiMap, FiHome, FiNavigation, FiClock, FiCalendar, FiSearch,  FiMapPin, FiAlertTriangle } from "react-icons/fi";
import { FaPlug } from "react-icons/fa";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function PortStatusPage() {
  const today = new Date().toISOString().split("T")[0];
  const [userLocation, setUserLocation] = useState({ lat: 8.6541, lng: 81.2139 });
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const navigate = useNavigate();

  // Get current logged in user from localStorage (email is used in your backend)
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {
        console.log("Location access denied, using default");
        setUserLocation({ lat: 8.6541, lng: 81.2139 });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Fetch ports with availability
  useEffect(() => {
    if (selectedDate && selectedTime) {
      setLoading(true);
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL + `/api/ports?date=${selectedDate}&time=${selectedTime}`
        )
        .then((res) => {
          const data = res.data.data || res.data; // your API returns { data: [...] }
          const portsWithDistance = data.map((port) => ({
            ...port,
            distance: getDistanceFromLatLonInKm(
              userLocation.lat,
              userLocation.lng,
              port.coordinates.lat,
              port.coordinates.lng
            ),
          }));
          portsWithDistance.sort((a, b) => a.distance - b.distance);
          setPorts(portsWithDistance);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load charging ports");
        })
        .finally(() => setLoading(false));
    }
  }, [userLocation, selectedDate, selectedTime]);

  const handleBooking = (portId, location, status) => {
    if (!currentUser) {
      toast.error("You must log in to book a port");
      navigate("/login");
      return;
    }
    if (status === "available") {
      navigate(
        `/port-booking/${portId}?date=${selectedDate}&bookingTime=${selectedTime}&location=${encodeURIComponent(location)}`
      );
    }
  };

  const handleCancelBooking = async (bookingId, portId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Booking cancelled successfully!");

      // Update UI instantly
      setPorts((prev) =>
        prev.map((p) =>
          p.portId === portId
            ? { ...p, status: "available", bookedBy: null, currentBookingId: null }
            : p
        )
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
      if (err.response?.status === 404) {
        toast.error("Booking not found or already cancelled");
      } else if (err.response?.status === 401) {
        toast.error("Please login again to cancel booking");
        navigate("/login");
      } else if (err.response?.status === 403) {
        toast.error("You are not authorized to cancel this booking");
      } else {
        toast.error("Failed to cancel booking. Please try again");
      }
    }
  };

  const renderActionButton = (port) => {
    const isMyBooking = port.bookedBy?.email === currentUser?.email;

    if (port.status === "available") {
      return (
        <button
          onClick={() => handleBooking(port.portId, port.location, port.status)}
          className="px-6 py-2 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200"
        >
          Book Now
        </button>
      );
    }

    if (isMyBooking) {
      return (
        <button
          onClick={() => handleCancelBooking(port.currentBookingId, port.portId)}
          className="px-6 py-2 rounded-xl font-bold bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200"
        >
          Cancel Booking
        </button>
      );
    }

    return (
      <button
        disabled
        className="px-6 py-2 rounded-xl font-bold bg-gray-300 text-gray-500 cursor-not-allowed"
      >
        Unavailable
      </button>
    );
  };

  const getStatusText = (port) => {
    if (port.status === "available") return "Available";
    if (port.bookedBy?.email === currentUser?.email) return "Booked by You";
    return "Booked";
  };

  const handleManualLocationSearch = async () => {
    if (!manualLocation.trim()) {
      toast.error("Please enter a location");
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          manualLocation
        )}`
      );
      const data = await res.json();
      if (data?.length > 0) {
        const { lat, lon } = data[0];
        setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        toast.success(`Location set to ${manualLocation}`);
      } else {
        toast.error("Location not found");
      }
    } catch (err) {
      console.error("Location search error:", err);
      if (err.message?.includes("Failed to fetch")) {
        toast.error("Network error. Please check your internet connection");
      } else if (err.message?.includes("timeout")) {
        toast.error("Location search timed out. Please try again");
      } else {
        toast.error("Failed to search location. Please try a different location");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Charging Ports
            </h1>
            <p className="text-gray-600">Find and book available charging stations near you</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            <FiHome className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Location Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-green-100">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiNavigation className="w-4 h-4 inline mr-1" /> 
                Search Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your location"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 placeholder-gray-400"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleManualLocationSearch}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Set Location
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-green-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setView("list")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition duration-200 ${
                  view === "list"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <FiList className="w-5 h-5" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setView("map")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition duration-200 ${
                  view === "map"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <FiMap className="w-5 h-5" />
                <span>Map View</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="w-4 h-4 inline mr-1" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiClock className="w-4 h-4 inline mr-1" />
                  Select Time 
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                >
                  <option value="">Choose Time</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Finding charging ports near you...</p>
            </div>
          </div>
        ) : (
          <>
            {/* List View */}
            {view === "list" && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
                {!selectedDate || !selectedTime ? (
                  <div className="p-8 text-center">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiClock className="w-12 h-12 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Select Date & Time</h3>
                    <p className="text-gray-600 mb-4">Please choose a date and time slot to view available charging ports</p>
                  </div>
                ) : ports.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiAlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Ports Available</h3>
                    <p className="text-gray-600">No charging ports found for the selected time</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                          <th className="px-6 py-4 text-left font-semibold">Port ID</th>
                          <th className="px-6 py-4 text-left font-semibold">Status</th>
                          <th className="px-6 py-4 text-left font-semibold">Location</th>
                          <th className="px-6 py-4 text-left font-semibold">Distance</th>
                          <th className="px-6 py-4 text-left font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ports.map((port, index) => (
                          <tr
                            key={port._id}
                            className={`border-b border-gray-100 transition duration-200 hover:bg-green-50 ${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <FaPlug className="w-3 h-3 text-orange-600" />
                                </div>
                                <span className="font-semibold text-gray-800">{port.portId}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    port.status === "available" ? "bg-green-500" : "bg-red-500"
                                  }`}
                                />
                                <span
                                  className={`font-semibold capitalize ${
                                    port.status === "available"
                                      ? "text-green-600"
                                      : port.bookedBy?.email === currentUser?.email
                                      ? "text-orange-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {getStatusText(port)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">                             
                                  <FiMapPin className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="font-medium text-gray-800">{port.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FiNavigation className="w-3 h-3 text-blue-600" />
                                </div>                            
                                <span className="font-semibold text-gray-700">
                                  {port.distance.toFixed(1)} km
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {renderActionButton(port)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Map View */}
            {view === "map" && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Charging Ports Map View</h3>
                </div>
                <div className="h-96 md:h-[500px] w-full">
                  <MapContainer
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={11}
                    style={{ height: "100%", width: "100%" }}
                    className="rounded-b-2xl"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>
                        <div className="text-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <FiNavigation className="w-4 h-4 text-white" />
                          </div>
                          <b>Your Location</b>
                        </div>
                      </Popup>
                    </Marker>
                    {ports.map((port) => (
                      <Marker
                        key={port._id}
                        position={[port.coordinates.lat, port.coordinates.lng]}
                      >
                        <Popup>
                          <div className="min-w-[220px]">
                            <div className="flex items-center space-x-2 mb-3">
                              <div>
                                <b className="text-gray-800">Port {port.portId}</b>
                                <p className="text-sm text-gray-600">
                                  {port.location} • {port.distance.toFixed(1)} km
                                </p>
                                <p
                                  className={`font-bold mt-2 ${
                                    port.status === "available"
                                      ? "text-green-600"
                                      : port.bookedBy?.email === currentUser?.email
                                      ? "text-orange-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {getStatusText(port)}
                                </p>
                                <div className="mt-3">
                                  {renderActionButton(port)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}