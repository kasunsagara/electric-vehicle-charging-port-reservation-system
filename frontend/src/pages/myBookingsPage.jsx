// MyBookingsPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  FiCalendar, 
  FiClock, 
  FiBattery, 
  FiDollarSign, 
  FiMapPin, 
  FiRefreshCw, 
  FiPackage,
  FiCpu
} from "react-icons/fi";

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get appropriate vehicle icon based on vehicle type
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case 'car':
        return '🚗';
      case 'bike':
        return '🏍️';
      case 'van':
        return '🚐';
      default:
        return '🚗';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">My Bookings</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            View and manage all your charging port reservations in one place
          </p>
          
          {/* Refresh Button */}
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="mt-4 flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition duration-200 shadow-lg hover:shadow-xl border border-green-200 mx-auto"
          >
            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Bookings'}</span>
          </button>
        </div>

        {loading ? (
          // Loading State
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your bookings...</p>
            </div>
          </div>
        ) : (
          // Bookings Content
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            {bookings.length === 0 ? (
              // Empty State
              <div className="text-center py-16 px-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven't made any charging port bookings yet. Start by exploring available ports and make your first reservation.
                </p>
                <button
                  onClick={() => window.location.href = '/port-status'}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg hover:shadow-xl"
                >
                  Find Charging Ports
                </button>
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
                        Vehicle Info
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Port ID
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Charger Type
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                        Charging Estimates
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                      <tr 
                        key={booking._id} 
                        className="hover:bg-green-50 transition duration-150 group"
                      >
                        {/* Booking ID & Status */}
                        <td className="px-6 py-6">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xs">B</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-800 text-lg">
                                  #{booking.bookingId}
                                </span>
                                {booking.status && (
                                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Vehicle Information */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                              {getVehicleIcon(booking.vehicleType)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800 capitalize">
                                {booking.vehicleType || "Vehicle"}
                              </span>
                              <span className="text-sm text-gray-600">
                                {booking.vehicleModel || "Not specified"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Port ID - Separate Column */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <FiMapPin className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 text-lg">
                                #{booking.portId}
                              </span>
                              <span className="text-xs text-gray-500">Port ID</span>
                            </div>
                          </div>
                        </td>

                        {/* Charger Type - Separate Column */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FiCpu className="w-5 h-5 text-green-600" />
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
                          <div className="flex flex-col space-y-2">
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

                        {/* Charging Estimates */}
                        <td className="px-6 py-6">
                          <div className="flex flex-col space-y-2">
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

        {/* Stats Summary */}
        {bookings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100 text-center">
              <div className="text-2xl font-bold text-gray-800 mb-2">{bookings.length}</div>
              <div className="text-gray-600">Total Bookings</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}
              </div>
              <div className="text-gray-600">Confirmed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {new Set(bookings.map(b => b.portId)).size}
              </div>
              <div className="text-gray-600">Unique Ports</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                Rs. {bookings.reduce((total, booking) => total + (parseFloat(booking.estimatedCost) || 0), 0)}
              </div>
              <div className="text-gray-600">Total Estimated Cost</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}