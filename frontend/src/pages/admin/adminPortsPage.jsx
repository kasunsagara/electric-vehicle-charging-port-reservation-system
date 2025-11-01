import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaChargingStation, FaPlug } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";

export default function AdminPortsPage() {
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPorts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/ports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPorts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching ports:", err);
      toast.error("Failed to fetch ports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPorts();
  }, []);

  const deletePort = async (id) => {
    if (!window.confirm("Are you sure you want to delete this port?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/ports/${id}`, {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <FaChargingStation className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Manage Charging Ports</h1>
                <p className="text-gray-600 mt-1">View and manage all charging stations in the system</p>
              </div>
            </div>
            <Link
              to="/admin/ports/addPort"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              <FaPlus className="w-4 h-4" />
              <span>Add Port</span>
            </Link>
          </div>
        </div>

        {loading ? (
          // Loading State
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading charging ports...</p>
            </div>
          </div>
        ) : (
          // Ports Table
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            {ports.length === 0 ? (
              // Empty State
              <div className="text-center py-16 px-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaChargingStation className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Ports Available</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven't added any charging ports yet. Start by adding your first charging station to the system.
                </p>
                <Link
                  to="/admin/ports/addPort"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Your First Port</span>
                </Link>
              </div>
            ) : (
              // Ports Table
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Port Details
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Coordinates
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Charger Options
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ports.map((port, index) => (
                      <tr 
                        key={port._id} 
                        className={`hover:bg-green-50 transition duration-150 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        {/* Port ID */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <FaPlug className="w-3 h-3 text-orange-600" />
                            </div>
                            <div>
                              <span className="font-bold text-gray-800 text-lg">{port.portId}</span>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <FiMapPin className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-gray-800 font-medium max-w-xs">{port.location}</span>
                          </div>
                        </td>

                        {/* Coordinates */}
                        <td className="px-6 py-6">
                          <div className="text-sm text-gray-600">
                            <div>Lat: {port.coordinates?.lat || 'N/A'}</div>
                            <div>Lng: {port.coordinates?.lng || 'N/A'}</div>
                          </div>
                        </td>

                        {/* Charger Options */}
                        <td className="px-6 py-6">
                          <div className="flex flex-wrap gap-2">
                            {port.chargerOptions?.map((opt, idx) => (
                              <div
                                key={idx}
                                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
                              >
                                {opt.type} - {opt.speed} kW
                              </div>
                            ))}
                            {(!port.chargerOptions || port.chargerOptions.length === 0) && (
                              <span className="text-gray-400 text-sm">No chargers</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/admin/ports/updatePort`, { state: { port } })}
                              className="flex items-center space-x-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition duration-200 shadow-sm hover:shadow-md"
                            >
                              <FaEdit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deletePort(port._id)}
                              className="flex items-center space-x-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition duration-200 shadow-sm hover:shadow-md"
                            >
                              <FaTrash className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}