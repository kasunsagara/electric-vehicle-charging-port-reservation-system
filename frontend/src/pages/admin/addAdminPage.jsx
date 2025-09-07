import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddAdminPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/users",
        { name, email, password, phone, role: "admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      navigate("/admin/users");
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white text-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Admin</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <label className="font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <label className="font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <label className="font-medium">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className={`w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Admin"}
        </button>
      </form>
    </div>
  );
}
