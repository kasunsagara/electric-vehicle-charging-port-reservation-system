// AdminBookingsPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function MyBookingsPage() {
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
    <div className="bg-green-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-300 text-black uppercase text-sm font-semibold">
                <th className="px-6 py-4 text-left">Booking ID</th>
                <th className="px-6 py-4 text-left">Port ID</th>
                <th className="px-6 py-4 text-left">Vehicle</th>
                <th className="px-6 py-4 text-left">Charger Type</th>
                <th className="px-6 py-4 text-left">Date & Time</th>
                <th className="px-6 py-4 text-left">Estimated Info</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 border-b">{booking.bookingId}</td>
                  <td className="px-6 py-4 border-b">{booking.portId}</td>

                  {/* Vehicle column */}
                  <td className="px-6 py-4 border-b">
                    <div className="flex flex-col">
                      <span>{booking.vehicleType || "-"}</span>
                      <span>{booking.vehicleModel || ""}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 border-b">{booking.chargerType}</td>

                  {/* Date & Time column */}
                  <td className="px-6 py-4 border-b">
                    <div className="flex flex-col">
                      <span>
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                      <span>{booking.bookingTime}</span>
                    </div>
                  </td>

                  {/* Estimated Info column */}
                  <td className="px-6 py-4 border-b">
                    <div className="flex flex-col">
                      <span>
                        Battery: {booking.estimatedBatteryCapacity || "-"} kWh
                      </span>
                      <span>
                        Time: {booking.estimatedChargingTime || "-"} hrs
                      </span>
                      <span>
                        Cost: Rs. {booking.estimatedCost || "-"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 italic">
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
