import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const [userLocation, setUserLocation] = useState({ lat: 8.5874, lng: 81.2152 });
  const [ports, setPorts] = useState([]);
  const [view, setView] = useState("list");
  const [selectedDate, setSelectedDate] = useState(today); // default today
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.error("Location error:", err)
    );
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/ports")
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
      .catch((err) => console.error("Error fetching ports:", err));
  }, [userLocation]);

  const handleBooking = (portId, location, status) => {
    if (status === "available" && selectedDate && selectedTime) {
      const encodedLocation = encodeURIComponent(location);
      window.location.href = `/port-booking/${portId}?date=${selectedDate}&timeSlot=${selectedTime}&location=${encodedLocation}`;
    } else {
      alert("Please select date and time slot first.");
    }
  };

  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Charging Port Status</h2>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <input
            type="date"
            value={selectedDate}
            min={today} // cannot select past dates
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Select Time</option>
            <option>08:00-09:00</option>
            <option>09:00-10:00</option>
            <option>10:00-11:00</option>
            <option>11:00-12:00</option>
            <option>12:00-13:00</option>
            <option>13:00-14:00</option>
            <option>14:00-15:00</option>
            <option>15:00-16:00</option>
            <option>16:00-17:00</option>
            <option>17:00-18:00</option>
            <option>18:00-19:00</option>
            <option>19:00-20:00</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded ${
            view === "list" ? "bg-teal-200 shadow font-semibold" : "bg-white"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setView("map")}
          className={`px-4 py-2 rounded ${
            view === "map" ? "bg-teal-200 shadow font-semibold" : "bg-white"
          }`}
        >
          Map View
        </button>
      </div>

      {view === "list" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-300 text-black uppercase text-sm font-semibold">
                <th className="px-6 py-3">Port</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Distance</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((port) => (
                <tr
                  key={port._id}
                  className={`border-b hover:bg-gray-100 transition-colors`}
                >
                  <td className="px-6 py-4 font-semibold">{port.portId}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center space-x-2 ${
                        port.status === "available" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <span
                        className={`h-3 w-3 rounded-full ${
                          port.status === "available" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span className="capitalize">{port.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">{port.location}</td>
                  <td className="px-6 py-4">{port.distance.toFixed(1)} km</td>
                  <td className="px-6 py-4">
                    <button
                      disabled={port.status !== "available"}
                      className={`px-4 py-2 rounded text-white font-semibold transition-colors ${
                        port.status === "available" ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => handleBooking(port.portId, port.location, port.status)}
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
            <Marker key={port._id} position={[port.coordinates.lat, port.coordinates.lng]}>
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
                    port.status === "available" ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => handleBooking(port.portId, port.location, port.status)}
                >
                  Book Now
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
