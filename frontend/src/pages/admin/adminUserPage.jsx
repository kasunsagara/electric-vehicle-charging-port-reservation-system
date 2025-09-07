// AdminUsersPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:5000/api/users/${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "User deletion failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Link
          to="/admin/users/addAdmin"
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg shadow-md"
        >
          Add Admin
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-300 text-black uppercase text-sm font-semibold">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 border-b">{user.name}</td>
                  <td className="px-6 py-4 border-b">{user.email}</td>
                  <td className="px-6 py-4 border-b">{user.phone}</td>
                  <td className="px-6 py-4 border-b capitalize">{user.role}</td>
                  <td className="px-6 py-4 border-b">
                    {user.email === "kasunsagara689@gmail.com" ? (
                      <button
                        disabled
                        className="bg-gray-400 text-white px-3 py-1 rounded-md shadow-sm text-sm cursor-not-allowed"
                      >
                        Protected
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteUser(user.email)} // ✅ use email
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No users available.
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
