import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AdminPortsPage() {
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const fetchPorts = async () => {
    setLoading(true); // start loading
    try {
      const res = await axios.get("http://localhost:5000/api/ports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPorts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching ports:", err);
      toast.error("Failed to fetch ports");
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchPorts();
  }, []);

  const deletePort = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/ports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message);
      fetchPorts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Port deletion failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Ports</h1>
        <Link
          to="/admin/ports/addPort"
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg shadow-md"
        >
          Add Port
        </Link>
      </div>

      {loading ? ( // ✅ show spinner while loading
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-300 text-black uppercase text-sm font-semibold">
                <th className="px-6 py-4 text-left">Port ID</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Coordinates</th>
                <th className="px-6 py-4 text-left">Charger Options</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((port) => (
                <tr key={port._id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 border-b">{port.portId}</td>
                  <td className="px-6 py-4 border-b">{port.location}</td>
                  <td className="px-6 py-4 border-b">
                    {port.coordinates?.lat}, {port.coordinates?.lng}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {port.chargerOptions?.map((opt, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-sm inline-block mr-2 mb-1"
                      >
                        {opt.type} - {opt.speed} kW
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => navigate(`/admin/ports/${port._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-sm text-sm mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePort(port._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {ports.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    No ports available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
