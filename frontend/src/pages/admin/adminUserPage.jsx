// AdminUsersPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaUsers, FaUserPlus, FaTrash, FaUserShield, FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.BACKEND_URL + "/api/users", {
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
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        import.meta.env.BACKEND_URL + `/api/users/${email}`,
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

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'customer':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <FaUserShield className="w-4 h-4" />;
      case 'customer':
        return <FaUser className="w-4 h-4" />;
      default:
        return <FaUser className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
                <p className="text-gray-600 mt-1">View and manage all system users</p>
              </div>
            </div>
            <Link
              to="/admin/users/addAdmin"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              <FaUserPlus className="w-4 h-4" />
              <span>Add Admin</span>
            </Link>
          </div>
        </div>

        {loading ? (
          // Loading State
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading users...</p>
            </div>
          </div>
        ) : (
          // Users Table
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            {users.length === 0 ? (
              // Empty State
              <div className="text-center py-16 px-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Users Available</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  There are no users registered in the system yet.
                </p>
              </div>
            ) : (
              // Users Table
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        User Details
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user, index) => (
                      <tr 
                        key={user._id} 
                        className={`hover:bg-green-50 transition duration-150 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        {/* User Details */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-gray-800 block">{user.name}</span>
                            </div>
                          </div>
                        </td>

                        {/* Email - Separate Column */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FaEnvelope className="w-3 h-3 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800 text-sm">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Phone - Separate Column */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <FaPhone className="w-3 h-3 text-green-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800 text-sm">
                                {user.phone || 'Not provided'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center space-x-1 ${getRoleColor(user.role)}`}>
                              {getRoleIcon(user.role)}
                              <span className="capitalize">{user.role}</span>
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-6">
                          {user.email === "kasunsagara689@gmail.com" ? (
                            <div className="flex items-center space-x-2 text-orange-600">
                              <FaLock className="w-4 h-4" />
                              <span className="text-sm font-medium">Protected</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => deleteUser(user.email)}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition duration-200 shadow-sm hover:shadow-md"
                            >
                              <FaTrash className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          )}
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