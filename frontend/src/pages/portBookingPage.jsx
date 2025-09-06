// src/pages/PortBookingPage.jsx
import { useState, useEffect } from "react";  
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ChargingEstimates from "../components/ChargingEstimates";
import toast from "react-hot-toast";

// Battery capacities per vehicle model (kWh)
const batteryCapacityMap = {
  "Tata Nexon EV": 30,
  "MG ZS EV": 44,
  "Hyundai Kona Electric": 39.2,
  "BYD Atto 3": 50,
  "Nissan Leaf": 40,
  "Revolt RV400": 3.24,
  "Hero Electric Optima": 1.6,
  "Ather 450X": 2.9,
  "Okinawa i-Praise": 2.0,
  "Tata Winger EV": 26,
  "Mahindra eSupro": 25,
  "Piaggio Ape Electric": 8,
};

const UNIT_RATE = 400; // Rs per hour

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
    carPhoto: null,
    bookingDate: bookingDate || "",
    bookingTime: bookingTime || "",
    portLocation: locationFromQuery || "",
  });

  const [realBookingId, setRealBookingId] = useState(null);
  const [showEstimates, setShowEstimates] = useState(false);
  const [finalbookingTime, setFinalbookingTime] = useState(bookingTime || "");

  const vehicleModels = {
    Car: ["Tata Nexon EV","MG ZS EV","Hyundai Kona Electric","BYD Atto 3","Nissan Leaf"],
    Bike: ["Revolt RV400","Hero Electric Optima","Ather 450X","Okinawa i-Praise"],
    Van: ["Tata Winger EV","Mahindra eSupro","Piaggio Ape Electric"]
  };

  // Fetch port details
  useEffect(() => {
    axios.get(`http://localhost:5000/api/ports/${portId}`)
      .then(res => {
        setPort(res.data);
        if (res.data.chargerOptions?.length > 0) {
          setFormData(prev => ({ ...prev, chargerType: res.data.chargerOptions[0].type }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load port details!");
        setLoading(false);
      });
  }, [portId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "carPhoto") {
      setFormData({ ...formData, carPhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === "vehicleType") {
        setFormData(prev => ({ ...prev, vehicleModel: "" }));
      }
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
        toast.error("You must be logged in to book a port."); 
        return; 
      }

      // 🔹 calculate estimates before saving
      const batteryCapacity = batteryCapacityMap[formData.vehicleModel] || 0;
      const charger = port?.chargerOptions.find(c => c.type === formData.chargerType);
      const chargingTime = charger ? batteryCapacity / charger.speed : 0;
      const estimatedCost = chargingTime * UNIT_RATE;

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      // 🔹 add calculated values
      data.append("estimatedBatteryCapacity", batteryCapacity);
      data.append("estimatedChargingTime", chargingTime.toFixed(2));
      data.append("estimatedCost", estimatedCost.toFixed(0));

      const res = await axios.post("http://localhost:5000/api/bookings", data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });

      setRealBookingId(res.data.booking.bookingId);
      setFinalbookingTime(formData.bookingTime);

      toast.success(`Booking confirmed! Your Booking ID: ${res.data.booking.bookingId}`);

      navigate("/my-bookings"); 

    } catch (error) {
      console.error(error);
      if (error.response) toast.error(error.response.data.message || "Booking failed!");
      else toast.error("Booking failed! Check console.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading port details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-start py-10 px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Booking Summary */}
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-sm h-[400px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 pb-2 text-center">Booking Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold">Port Id:</span>
              <span className="font-medium">{formData.portId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Location:</span>
              <span className="font-medium">{formData.portLocation || port?.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span className="font-medium">{formData.bookingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Time:</span>
              <span className="font-medium">{finalbookingTime || formData.bookingTime}</span>
            </div>
            {realBookingId && (
              <div className="mt-4 p-3 bg-white/20 text-center text-green-100">
                Booking ID: {realBookingId}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white p-6 text-gray-800 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4 pb-2 text-center">Book Charging Port</h2>

          <form onSubmit={handleCalculateEstimates} className="space-y-4">
            <div>
              <label className="font-semibold">Vehicle Type</label>
              <select 
                name="vehicleType" 
                value={formData.vehicleType} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2"
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Van">Van</option>
              </select>
            </div>

            <div>
              <label className="font-semibold">Vehicle Model</label>
              <select 
                name="vehicleModel" 
                value={formData.vehicleModel} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Model</option>
                {vehicleModels[formData.vehicleType].map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold">Charger Type</label>
              {port?.chargerOptions?.length > 0 ? (
                <select 
                  name="chargerType" 
                  value={formData.chargerType} 
                  onChange={handleChange} 
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  {port.chargerOptions.map(option => (
                    <option key={option.type} value={option.type}>
                      {option.type} ({option.speed} kW)
                    </option>
                  ))}
                </select>
              ) : <p>No charger options available</p>}
            </div>

            <div>
              <label className="font-semibold">Car Photo (Optional)</label>
              <div className="flex items-center border rounded px-3 py-2">
                <label className="bg-gray-100 text-black px-3 py-1 rounded border border-black cursor-pointer hover:bg-gray-200">
                  Choose File
                  <input 
                    type="file" 
                    name="carPhoto" 
                    accept="image/*" 
                    onChange={handleChange} 
                    className="hidden" 
                  />
                </label>
                <span className="flex-1 text-gray-600 truncate ml-2">
                  {formData.carPhoto ? formData.carPhoto.name : "No file chosen"}
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className="mt-3 w-full bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700">
              Calculate Estimates
            </button>
          </form>

          {showEstimates && (
            <div className="mt-4">
              <ChargingEstimates 
                chargerType={formData.chargerType} 
                vehicleModel={formData.vehicleModel} 
                port={port} 
              />
              <button 
                onClick={handleConfirmBooking} 
                className="mt-3 w-full bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700">
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
