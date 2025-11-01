// AdminBookingsPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaHashtag, FaCalendarCheck, FaPlug, FaCar, FaMotorcycle, FaTruckPickup, FaShuttleVan, FaBolt } from "react-icons/fa";
import { FiUser, FiCalendar,  FiClock, FiBattery, FiDollarSign } from "react-icons/fi";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false); 

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.BACKEND_URL + "/api/bookings", {
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

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case 'car':
        return <FaCar className="w-3 h-3 text-blue-600" />;
      case 'bike':
        return <FaMotorcycle className="w-3 h-3 text-blue-600" />;
      case 'threewheeler':
        return <FaTruckPickup className="w-3 h-3 text-blue-600" />;        
      case 'van':
        return <FaShuttleVan className="w-3 h-3 text-blue-600" />;
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
                <FaCalendarCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
                <p className="text-gray-600 mt-1">View and monitor all charging port reservations</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          // Loading State
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading bookings...</p>
            </div>
          </div>
        ) : (
          // Bookings Table
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            {bookings.length === 0 ? (
              // Empty State
              <div className="text-center py-16 px-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarCheck className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Available</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  There are no charging port bookings in the system yet.
                </p>
              </div>
            ) : (
              // Bookings Table
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Booking Details
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        User Information
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Port ID
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Charger Type
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Charging Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking, index) => (
                      <tr 
                        key={booking._id} 
                        className={`hover:bg-green-50 transition duration-150 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        {/* Booking ID & Status */}
                        <td className="px-6 py-6">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaHashtag className="w-3 h-3 text-green-600" />
                              </div>
                              <div>
                                <span className="font-bold text-gray-800 text-lg">
                                  {booking.bookingId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* User Information */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiUser className="w-3 h-3 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800">{booking.name}</span>
                              <span className="text-sm text-gray-600">{booking.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Port ID - Separate Column */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <FaPlug className="w-3 h-3 text-orange-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 text-lg">
                                {booking.portId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Vehicle - Separate Column */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                              {getVehicleIcon(booking.vehicleType)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800 capitalize">
                                {booking.vehicleType || "Vehicle"}
                              </span>
                              <span className="text-xs text-gray-600">
                                {booking.vehicleModel || "Not specified"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Charger Type - Separate Column */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <FaBolt className="w-3 h-3 text-green-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800">
                                {booking.chargerType || "Standard"}
                              </span>
                              <span className="text-xs text-gray-500">Charger Type</span>
                            </div>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <FiCalendar className="w-4 h-4 text-purple-600" />
                              <span className="font-medium text-gray-800">
                                {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }) : 'Not set'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiClock className="w-4 h-4 text-orange-600" />
                              <span className="text-sm text-gray-600">
                                {booking.bookingTime || 'Not specified'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Charging Details */}
                        <td className="px-6 py-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <FiBattery className="w-4 h-4 text-green-600" />
                              <span className="text-sm">
                                <span className="font-medium text-gray-800">
                                  {booking.estimatedBatteryCapacity || "0"}
                                </span>
                                <span className="text-gray-600"> kWh</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiClock className="w-4 h-4 text-blue-600" />
                              <span className="text-sm">
                                <span className="font-medium text-gray-800">
                                  {booking.estimatedChargingTime || "0"}
                                </span>
                                <span className="text-gray-600"> hours</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiDollarSign className="w-4 h-4 text-red-600" />
                              <span className="text-sm">
                                <span className="font-medium text-gray-800">
                                  Rs. {booking.estimatedCost || "0"}
                                </span>
                              </span>
                            </div>
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