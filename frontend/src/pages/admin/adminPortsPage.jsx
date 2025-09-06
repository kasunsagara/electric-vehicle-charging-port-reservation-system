import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminPortsPage() {
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/ports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // admin token
        },
      })
      .then((res) => {
        setPorts(res.data.data); // backend response => { message, data }
      })
      .catch((err) => {
        console.error("Error fetching ports:", err);
      });
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this port?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/ports/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPorts(ports.filter((p) => p._id !== id)); // remove from UI
    } catch (err) {
      console.error("Error deleting port:", err);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Ports</h1>
      <Link
        to="/admin/ports/new"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add New Port
      </Link>
      <table className="min-w-full mt-4 border">
        <thead>
          <tr>
            <th className="border-b py-2">Port ID</th>
            <th className="border-b py-2">Location</th>
            <th className="border-b py-2">Coordinates</th>
            <th className="border-b py-2">Charger Options</th>
            <th className="border-b py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ports.map((port) => (
            <tr key={port._id}>
              <td className="border-b py-2">{port.portId}</td>
              <td className="border-b py-2">{port.location}</td>
              <td className="border-b py-2">
                {port.coordinates?.lat}, {port.coordinates?.lng}
              </td>
              <td className="border-b py-2">
                {port.chargerOptions?.map((opt, idx) => (
                  <div key={idx}>
                    {opt.type} - {opt.speed} kW
                  </div>
                ))}
              </td>
              <td className="border-b py-2">
                <Link
                  to={`/admin/ports/${port._id}`}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </Link>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(port._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
