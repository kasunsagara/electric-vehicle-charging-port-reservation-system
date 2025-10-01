import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddPortPage() {
  const [portId, setPortId] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [normalSpeed, setNormalSpeed] = useState("");
  const [fastSpeed, setFastSpeed] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      await axios.post("http://localhost:5000/api/ports", newPort, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Port added successfully!");
      navigate("/admin/ports");
    } catch (err) {
      console.error("Error adding port:", err.response?.data || err);
      toast.error("Failed to add port");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white text-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Port</h2>

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
        <label className="font-medium">Latitude Value</label>
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <label className="font-medium">Longitude Value</label>
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
          Add Port
        </button>
      </form>
    </div>
  );
}
