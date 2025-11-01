import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaTachometerAlt, FaChargingStation, FaUsers, FaCalendarCheck } from "react-icons/fa";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminDashboardPage() {
  const [totalPorts, setTotalPorts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized: Please log in first");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [portsRes, usersRes, bookingsRes, feedbacksRes] = await Promise.all([
          axios.get(import.meta.env.VITE_BACKEND_URL + "/api/ports", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(import.meta.env.VITE_BACKEND_URL + "/api/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(import.meta.env.VITE_BACKEND_URL + "/api/feedbacks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTotalPorts(portsRes.data.data?.length || 0);
        setTotalUsers(usersRes.data.users?.length || 0);
        setTotalBookings(bookingsRes.data.bookings?.length || 0);
        setTotalFeedbacks(feedbacksRes.data?.length || 0);

        // Group bookings by date for chart
        const bookings = bookingsRes.data.bookings || [];
        const grouped = bookings.reduce((acc, booking) => {
          const date = new Date(booking.bookingDate)
            .toISOString()
            .split("T")[0]; // YYYY-MM-DD
          if (!acc[date]) acc[date] = 0;
          acc[date]++;
          return acc;
        }, {});

        const chartArray = Object.keys(grouped)
          .sort((a, b) => new Date(a) - new Date(b))
          .map((date) => ({ date, count: grouped[date] }));

        setChartData(chartArray);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */} 
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <FaTachometerAlt className="w-6 h-6 text-white" />
              </div>        
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Overview of system statistics and performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards - Your original layout with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Total Ports Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <FaChargingStation className="text-3xl text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Total Ports</h2>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalPorts}</p>
              </div>
            </div>
          </div>

          {/* Total Users Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <FaUsers className="text-3xl text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Total Users</h2>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <FaCalendarCheck className="text-3xl text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Total Bookings</h2>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalBookings}</p>
              </div>
            </div>
          </div>

          {/* Total Feedbacks Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <FaTachometerAlt className="text-3xl text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Total Feedbacks</h2>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalFeedbacks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Over Time Chart - Your original chart with enhanced styling */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Bookings Over Time</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FaCalendarCheck className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg">No booking data available</p>
              <p className="text-sm mt-2">Booking data will appear here once users start making reservations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}