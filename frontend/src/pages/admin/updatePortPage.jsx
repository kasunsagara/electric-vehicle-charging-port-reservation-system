import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdatePortPage() {
  const loc = useLocation();
  const navigate = useNavigate();
  const port = loc.state?.port;

  // Redirect if no port data
  useEffect(() => {
    if (!port) {
      navigate("/admin/ports");
    }
  }, [port, navigate]);

  const [portId, setPortId] = useState(port?.portId || "");
  const [location, setLocation] = useState(port?.location || "");
  const [lat, setLat] = useState(port?.coordinates?.lat || "");
  const [lng, setLng] = useState(port?.coordinates?.lng || "");
  const [normalSpeed, setNormalSpeed] = useState(port?.chargerOptions?.[0]?.speed || "");
  const [fastSpeed, setFastSpeed] = useState(port?.chargerOptions?.[1]?.speed || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedPort = {
        portId,
        location,
        coordinates: {
          lat: parseFloat(lat) || 0,
          lng: parseFloat(lng) || 0,
        },
        chargerOptions: [
          { type: "normal", speed: parseFloat(normalSpeed) || 0 },
          { type: "fast", speed: parseFloat(fastSpeed) || 0 },
        ],
      };

      // Send update request to backend
      await axios.put(`http://localhost:5000/api/ports/${port._id}`, updatedPort);

      toast.success("Port updated successfully!");
      navigate("/admin/ports");
    } catch (err) {
      console.error("Error updating port:", err.response?.data || err);
      toast.error("Failed to update port");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white text-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Port</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="font-medium">Port ID</label>
        <input
          type="text"
          value={portId}
          onChange={(e) => setPortId(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <label className="font-medium">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <h3 className="text-[17px] font-semibold">Coordinates</h3>
        <label className="font-medium">Latitude</label>
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <label className="font-medium">Longitude</label>
        <input
          type="number"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <h3 className="text-[17px] font-semibold">Charger Options</h3>
        <label className="font-medium">Normal Charger Speed (kW)</label>
        <input
          type="number"
          value={normalSpeed}
          onChange={(e) => setNormalSpeed(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <label className="font-medium">Fast Charger Speed (kW)</label>
        <input
          type="number"
          value={fastSpeed}
          onChange={(e) => setFastSpeed(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
        >
          Update Port
        </button>
      </form>
    </div>
  );
}
