import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaChargingStation, FaUsers, FaCalendarCheck } from "react-icons/fa";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminDashboardPage() {
  const [totalPorts, setTotalPorts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
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
        const [portsRes, usersRes, bookingsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/ports", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTotalPorts(portsRes.data.data?.length || 0);
        setTotalUsers(usersRes.data.users?.length || 0);
        setTotalBookings(bookingsRes.data.bookings?.length || 0);

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
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow flex items-center gap-4">
          <FaChargingStation className="text-4xl text-teal-500" />
          <div>
            <h2 className="text-xl font-bold">Total Ports</h2>
            <p className="text-2xl">{totalPorts}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center gap-4">
          <FaUsers className="text-4xl text-teal-500" />
          <div>
            <h2 className="text-xl font-bold">Total Users</h2>
            <p className="text-2xl">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center gap-4">
          <FaCalendarCheck className="text-4xl text-teal-500" />
          <div>
            <h2 className="text-xl font-bold">Total Bookings</h2>
            <p className="text-2xl">{totalBookings}</p>
          </div>
        </div>
      </div>

      {/* Bookings Over Time Chart */}
      <div className="mt-10 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Bookings Over Time</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No booking data available</p>
        )}
      </div>
    </div>
  );
}
