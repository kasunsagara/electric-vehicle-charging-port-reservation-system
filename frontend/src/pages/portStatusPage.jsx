import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiList, FiMap } from "react-icons/fi";

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
  const [userLocation, setUserLocation] = useState({ lat: 8.6541, lng: 81.2139 }); // Default Trincomalee Campus location
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const navigate = useNavigate();

  // ✅ Detect user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => {
        console.error("Location error:", err);
        // fallback location = Trincomalee Campus
        setUserLocation({ lat: 8.6541, lng: 81.2139 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // ✅ Fetch ports data
  useEffect(() => {
    if (selectedDate && selectedTime) {
      setLoading(true);
      axios
        .get(
          `http://localhost:5000/api/ports?date=${selectedDate}&time=${selectedTime}`
        )
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : res.data.data;
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
          console.error("Error fetching ports:", err);
          toast.error("Error fetching port data!");
        })
        .finally(() => setLoading(false));
    }
  }, [userLocation, selectedDate, selectedTime]);

  // ✅ Booking handler
  const handleBooking = (portId, location, status) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("You must log in to book a charging port!");
      navigate("/login");
      return;
    }

    if (status === "available" && selectedDate && selectedTime) {
      const encodedLocation = encodeURIComponent(location);
      navigate(
        `/port-booking/${portId}?date=${selectedDate}&bookingTime=${selectedTime}&location=${encodedLocation}`
      );
    } else {
      toast.error("Please select date and time slot first.");
    }
  };

  // ✅ Manual location search by name
  const handleManualLocationSearch = async () => {
    if (!manualLocation) {
      toast.error("Please enter a location name!");
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          manualLocation
        )}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        toast.success(`Location set to ${manualLocation}`);
      } else {
        toast.error("Location not found!");
      }
    } catch (err) {
      console.error("Error fetching location:", err);
      toast.error("Failed to fetch location!");
    }
  };

  return (
    <div className="p-6 bg-green-100 min-h-screen">
      {/* Header with Home button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Charging Port Status</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Home
        </button>
      </div>

      {/* Manual location search */}
      <div className="flex flex-col md:flex-row items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter manual location"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
          className="px-3 py-2 rounded bg-white shadow w-72"
        />
        <button
          onClick={handleManualLocationSearch}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Set Location
        </button>
      </div>

      {/* Top bar: View toggle left, Filters right */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        {/* List/Map toggle */}
        <div className="flex space-x-2 mb-4 md:mb-0">
          <button
            onClick={() => setView("list")}
            className={`flex items-center space-x-1 px-4 py-2 rounded ${
              view === "list" ? "bg-teal-200 shadow" : "bg-white shadow"
            }`}
          >
            <FiList />
            <span>List View</span>
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center space-x-1 px-4 py-2 rounded ${
              view === "map" ? "bg-teal-200 shadow" : "bg-white shadow"
            }`}
          >
            <FiMap />
            <span>Map View</span>
          </button>
        </div>

        {/* Date & Time filters */}
        <div className="flex space-x-2 justify-end">
          <input
            type="date"
            value={selectedDate}
            min={today}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded px-3 py-2 bg-white shadow"
          />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="rounded px-3 py-2 bg-white shadow"
          >
            <option value="">Select Time</option>
            <option value="08:00">08:00</option>
            <option value="13:00">13:00</option>
            <option value="18:00">18:00</option>
          </select>
        </div>
      </div>

      {/* Spinner */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* List View */}
          {view === "list" && (
            <>
              {!selectedDate || !selectedTime ? (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded mb-4">
                  Please select date and time to view charging port details.
                </div>
              ) : ports.length === 0 ? (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
                  No ports available for the selected time.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left bg-white rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-gray-300 text-black uppercase text-sm font-semibold">
                        <th className="px-6 py-4">Port</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Distance</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ports.map((port) => (
                        <tr
                          key={port._id}
                          className="border-b hover:bg-gray-100 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold">
                            {port.portId}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`flex items-center space-x-2 ${
                                port.status === "available"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              <span
                                className={`h-3 w-3 rounded-full ${
                                  port.status === "available"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></span>
                              <span className="capitalize">
                                {port.status}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4">{port.location}</td>
                          <td className="px-6 py-4">
                            {port.distance.toFixed(1)} km
                          </td>
                          <td className="px-6 py-4">
                            <button
                              disabled={port.status !== "available"}
                              className={`px-4 py-2 rounded text-white font-semibold transition-colors ${
                                port.status === "available"
                                  ? "bg-orange-500 hover:bg-orange-600"
                                  : "bg-gray-400 cursor-not-allowed"
                              }`}
                              onClick={() =>
                                handleBooking(
                                  port.portId,
                                  port.location,
                                  port.status
                                )
                              }
                            >
                              Book Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Map View */}
          {view === "map" && (
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={11}
              style={{ height: "500px", width: "100%" }}
              className="rounded-lg shadow"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>You are here</Popup>
              </Marker>
              {ports.map((port) => (
                <Marker
                  key={port._id}
                  position={[port.coordinates.lat, port.coordinates.lng]}
                >
                  <Popup>
                    <b>Port {port.portId}</b>
                    <br />
                    {port.location}
                    <br />
                    Distance: {port.distance.toFixed(2)} km
                    <br />
                    Status: {port.status}
                    <br />
                    <button
                      disabled={port.status !== "available"}
                      className={`px-2 py-1 rounded text-white font-semibold ${
                        port.status === "available"
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        handleBooking(port.portId, port.location, port.status)
                      }
                    >
                      Book Now
                    </button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </>
      )}
    </div>
  );
}
