import { useState, useEffect } from "react";  
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import ChargingEstimates from "../components/chargingEstimates"; // adjust path

export default function PortBookingPage() {
  const { portId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const bookingDate = queryParams.get("date");
  const timeSlot = queryParams.get("timeSlot");
  const locationFromQuery = queryParams.get("location");

  const [port, setPort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    portId: portId,
    vehicleType: "Car",
    vehicleModel: "",
    chargerType: "", 
    carPhoto: null,
    bookingDate: bookingDate || "",
    timeSlot: timeSlot || "",
    portLocation: locationFromQuery || "",
  });

  const [realBookingId, setRealBookingId] = useState(null);
  const [showEstimates, setShowEstimates] = useState(false);

  // Sri Lanka EV Models by type
  const vehicleModels = {
    Car: ["Tata Nexon EV","MG ZS EV","Hyundai Kona Electric","BYD Atto 3","Nissan Leaf"],
    Bike: ["Revolt RV400","Hero Electric Optima","Ather 450X","Okinawa i-Praise"],
    Van: ["Tata Winger EV","Mahindra eSupro","Piaggio Ape Electric"]
  };

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
        setLoading(false);
      });
  }, [portId]);

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

  // Only show estimates, don't send booking yet
  const handleCalculateEstimates = (e) => {
    e.preventDefault();
    setShowEstimates(true);
  };

  // Send booking request on confirm
  const handleConfirmBooking = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setRealBookingId(response.data.booking.bookingId);
      alert(`Booking confirmed! Your Booking ID: ${response.data.booking.bookingId}`);
    } catch (error) {
      console.error(error);
      alert("Booking confirmation failed!");
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
        <div className="bg-teal-50 text-gray-800 p-6 rounded-2xl shadow-sm h-[400px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 border-b border-white/50 pb-2">Booking Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Port Id:</span>
              <span className="font-semibold">{formData.portId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Location:</span>
              <span className="font-semibold">{formData.portLocation || port?.location}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Date:</span>
              <span className="font-semibold">{formData.bookingDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Time Slot:</span>
              <span className="font-semibold">{formData.timeSlot}</span>
            </div>

            {realBookingId && (
              <div className="mt-4 p-3 bg-white/20 rounded-lg text-center font-semibold text-green-100">
                Booking ID: {realBookingId}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-teal-50 p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 border-b border-white/50 pb-2">Book Charging Port</h2>

          <form onSubmit={handleCalculateEstimates} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Vehicle Type</label>
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
              <label className="block mb-1 font-medium">Vehicle Model</label>
              <select
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Model</option>
                {vehicleModels[formData.vehicleType].map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Charger Type</label>
              {port?.chargerOptions?.length > 0 ? (
                <select
                  name="chargerType"
                  value={formData.chargerType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  {port.chargerOptions.map((option) => (
                    <option key={option.type} value={option.type}>
                      {option.type} ({option.speed} kW)
                    </option>
                  ))}
                </select>
              ) : (
                <p>No charger options available</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Car Photo (Optional)</label>
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
              className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
            >
              Calculate Estimates
            </button>
          </form>

          {/* Charging Estimates + Confirm Button */}
          {showEstimates && (
            <div className="mt-4">
              <ChargingEstimates
                chargerType={formData.chargerType}
                vehicleModel={formData.vehicleModel}
                port={port}
              />

              <button
                onClick={handleConfirmBooking}
                className="mt-3 w-full bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
