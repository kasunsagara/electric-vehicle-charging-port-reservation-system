import { useState, useEffect } from "react"; 
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

export default function PortBookingPage() {
  const { portId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const bookingDate = queryParams.get("date");
  const timeSlot = queryParams.get("timeSlot");
  const locationFromQuery = queryParams.get("location");

  const [port, setPort] = useState(null);
  const [formData, setFormData] = useState({
    portId: portId,
    vehicleType: "Car",
    vehicleModel: "",
    chargerType: "normal",
    carPhoto: null,
    bookingDate: bookingDate || "",
    timeSlot: timeSlot || "",
    portLocation: locationFromQuery || "",
  });

  const [realBookingId, setRealBookingId] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/ports/${portId}`)
      .then(res => setPort(res.data))
      .catch(err => console.error(err));
  }, [portId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "carPhoto") {
      setFormData({ ...formData, carPhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      const response = await axios.post("http://localhost:5000/api/bookings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const bookingIdFromBackend = response.data.booking.bookingId;
      setRealBookingId(bookingIdFromBackend);
      alert(`Booking successful! Your Booking ID: ${bookingIdFromBackend}`);
    } catch (error) {
      console.error(error);
      alert("Booking failed!");
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex justify-center items-start py-10 px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Booking Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
          <p><strong>Port Id:</strong> {formData.portId || port?.portId}</p>
          <p><strong>Location:</strong> {formData.portLocation || port?.location}</p>
          <p><strong>Date:</strong> {formData.bookingDate}</p>
          <p><strong>Time Slot:</strong> {formData.timeSlot}</p>
          {realBookingId && (
            <p className="mt-2 text-green-700 font-semibold">Booking ID: {realBookingId}</p>
          )}
        </div>

        {/* Booking Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Book Charging Port</h2>
          <p className="text-gray-500 mb-4">
            Enter your vehicle details to get a charging estimate.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <input
                type="text"
                name="vehicleModel"
                placeholder="Ex: Tata Nexon EV"
                value={formData.vehicleModel}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Charger Type</label>
              <select
                name="chargerType"
                value={formData.chargerType}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="normal">Normal (kW)</option>
                <option value="fast">Fast (20kW)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Car Photo (Optional)</label>
              <input
                type="file"
                name="carPhoto"
                accept="image/*"
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800"
            >
              Calculate Estimates
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
