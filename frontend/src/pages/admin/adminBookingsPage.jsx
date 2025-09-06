// AdminBookingsPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false); 

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Bookings fetched:", res.data);

      const bookingsArray = res.data.bookings || [];
      setBookings(bookingsArray);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-300 text-black uppercase text-sm font-semibold">
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Port ID</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Charger Type</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Estimated Info</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-4 py-3 border-b">{booking.bookingId}</td>
                  <td className="px-4 py-3 border-b">
                    {booking.userName} ({booking.email})
                  </td>
                  <td className="px-4 py-3 border-b">{booking.portId}</td>
                  <td className="px-4 py-3 border-b">
                    {booking.vehicleType || "-"} {booking.vehicleModel || ""}
                  </td>
                  <td className="px-4 py-3 border-b">{booking.chargerType}</td>
                  <td className="px-4 py-3 border-b">
                    {new Date(booking.bookingDate).toLocaleDateString()}{" "}
                    {booking.bookingTime}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div>Battery: {booking.estimatedBatteryCapacity || "-"} kWh</div>
                    <div>Time: {booking.estimatedChargingTime || "-"} hrs</div>
                    <div>Cost: ${booking.estimatedCost || "-"}</div>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                    No bookings available.
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
