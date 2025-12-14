import { useState, useEffect } from "react";  
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ChargingEstimates from "../components/ChargingEstimates";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiMapPin, FiBattery, FiCheckCircle } from "react-icons/fi";
import { FaPlug } from "react-icons/fa";

// Battery capacities per vehicle model (kWh)
const batteryCapacityMap = {
  // Cars
  "Tata Nexon EV": 30.2,
  "Tata Tigor EV": 26.2,
  "MG ZS EV": 44,
  "Hyundai Kona Electric": 39.2,
  "BYD Atto 3": 49.8,
  "Nissan Leaf": 40,

  // Bikes
  "Revolt RV400": 3.2,
  "Hero Electric Optima": 1.6,
  "Okinawa i-Praise": 2.0,
  "TVS iQube": 3.4,
  "Bajaj Chetak Electric": 3,
  "Ola S1 Pro": 4,

  // Three Wheelers
  "NanoCar EV": 10.5,
  "Micro Luxury EV": 12.8,
  "VIdeo Tron EV": 9,

  // Vans
  "Tata Winger EV": 26,
  "Mahindra eSupro": 25,
  "Piaggio Ape Electric": 8,
};

const getUnitRateByPower = (power) => {
  if (power >= 20) return 800; // Fast
  return 300; // Normal
};


export default function PortBookingPage() {
  const { portId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const bookingDate = queryParams.get("date");
  const bookingTime = queryParams.get("bookingTime");
  const locationFromQuery = queryParams.get("location");

  const [port, setPort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    portId,
    vehicleType: "Car",
    vehicleModel: "",
    chargerType: "", 
    bookingDate: bookingDate || "",
    bookingTime: bookingTime || "",
    portLocation: locationFromQuery || "",
  });

  const [realBookingId, setRealBookingId] = useState(null);
  const [showEstimates, setShowEstimates] = useState(false);
  const [finalbookingTime, setFinalbookingTime] = useState(bookingTime || "");

  const vehicleModels = {
    Car: ["Tata Nexon EV", "Tata Tigor EV", "MG ZS EV", "Hyundai Kona Electric", "BYD Atto 3", "Nissan Leaf"],
    Bike: ["Revolt RV400", "Hero Electric Optima", "Okinawa i-Praise", "TVS iQube", "Bajaj Chetak Electric", "Ola S1 Pro"],
    ThreeWheeler: ["NanoCar EV", "Micro Luxury EV", "VIdeo Tron EV"],
    Van: ["Tata Winger EV", "Mahindra eSupro", "Piaggio Ape Electric"]
  };

  // Fetch port details
  useEffect(() => {
    axios.get(import.meta.env.VITE_BACKEND_URL + `/api/ports/${portId}`)
      .then(res => {
        setPort(res.data);
        if (res.data.chargerOptions?.length > 0) {
          setFormData(prev => ({ ...prev, chargerType: res.data.chargerOptions[0].type }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load port details");
        setLoading(false);
      });
  }, [portId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "vehicleType") {
      setFormData(prev => ({ ...prev, vehicleModel: "" }));
    }
  };

  // Calculate estimates
  const handleCalculateEstimates = (e) => {
    e.preventDefault();
    setShowEstimates(true);
    setFinalbookingTime(formData.bookingTime);
  };

  // Confirm booking & navigate
  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to book a port");
        return;
      }

      const batteryCapacity =
        batteryCapacityMap[formData.vehicleModel] || 0;

      const charger = port.chargerOptions.find(
        (c) => c.type === formData.chargerType
      );

      if (!charger) {
        toast.error("Invalid charger type");
        return;
      }

      const chargingTime = batteryCapacity / charger.speed;
      const unitRate = getUnitRateByPower(charger.speed);
      const estimatedCost = chargingTime * unitRate;

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("estimatedBatteryCapacity", batteryCapacity);
      data.append("estimatedChargingTime", chargingTime.toFixed(2));
      data.append("unitRate", unitRate);
      data.append("estimatedCost", estimatedCost.toFixed(0));

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/bookings",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRealBookingId(res.data.booking.bookingId);

      toast.success(
        `Booking confirmed and Your Booking ID is ${res.data.booking.bookingId}`
      );
      navigate("/myBookings");
    } catch (error) {
      console.error(error);
      toast.error("Booking failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading port details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Book Charging Port
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your booking details and confirm your charging session
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Booking Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <FaPlug className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-700">Port ID</span>
                </div>
                <span className="font-bold text-gray-800">{formData.portId}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <FiMapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-700">Location</span>
                </div>
                <span className="font-medium text-gray-800 text-right max-w-xs">
                  {formData.portLocation || port?.location}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3">
                  <FiCalendar className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-700">Date</span>
                </div>
                <span className="font-medium text-gray-800">{formData.bookingDate}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-3">
                  <FiClock className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-700">Time</span>
                </div>
                <span className="font-medium text-gray-800">
                  {finalbookingTime || formData.bookingTime}
                </span>
              </div>

              {realBookingId && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <FiCheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Booking Confirmed!</span>
                  </div>
                  <p className="text-sm">Your Booking ID: <span className="font-bold">{realBookingId}</span></p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FiBattery className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
            </div>

            <form onSubmit={handleCalculateEstimates} className="space-y-6">
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select 
                  name="vehicleType" 
                  value={formData.vehicleType} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white"
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="ThreeWheeler">Three Wheeler</option>
                  <option value="Van">Van</option>
                </select>
              </div>

              {/* Vehicle Model */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Model
                </label>
                <select 
                  name="vehicleModel" 
                  value={formData.vehicleModel} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white"
                  required
                >
                  <option value="">Select Vehicle Model</option>
                  {vehicleModels[formData.vehicleType].map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Charger Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charger Type
                </label>
                {port?.chargerOptions?.length > 0 ? (
                  <select 
                    name="chargerType" 
                    value={formData.chargerType} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white"
                    required
                  >
                    {port.chargerOptions.map(option => (
                      <option key={option.type} value={option.type}>
                        {option.type} ({option.speed} kW)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    No charger options available for this port
                  </div>
                )}
              </div>

              {/* Calculate Estimates Button */}
              <button 
                type="submit" 
                disabled={!formData.vehicleModel || !formData.chargerType}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Calculate Charging Estimates
              </button>
            </form>

            {/* Estimates Section */}
            {showEstimates && (
              <div>
                <ChargingEstimates 
                  chargerType={formData.chargerType} 
                  vehicleModel={formData.vehicleModel} 
                  port={port} 
                />
                
                {/* Confirm Booking Button */}
                <button 
                  onClick={handleConfirmBooking} 
                  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}