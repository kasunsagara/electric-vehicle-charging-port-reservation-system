import Booking from "../models/booking.js";
import Port from "../models/port.js";

// ---------------------------
// Create a new booking
// ---------------------------
export async function createBooking(req, res) {
  try {
    const {
      user,
      portId,
      vehicleType,
      vehicleModel,
      chargerType,
      bookingDate,          // Date object or "YYYY-MM-DD"
      startHour,            // Integer, e.g., 8
      duration,             // Float, e.g., 2.5 hours
      estimatedBatteryCapacity
    } = req.body;

    // Round up duration to nearest hour
    const hoursNeeded = Math.ceil(duration);

    // Construct start and end Date objects
    const startTime = new Date(bookingDate);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startHour + hoursNeeded);

    // Check overlapping bookings for the same port
    const conflict = await Booking.findOne({
      port: portId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: "Time conflict with existing booking" });
    }

    // Get charger speed from port
    const portData = await Port.findById(portId);
    if (!portData) return res.status(404).json({ message: "Port not found" });

    const chargerOption = portData.chargerOptions.find(c => c.type === chargerType);
    if (!chargerOption) return res.status(400).json({ message: "Invalid charger type" });

    const chargerSpeed = chargerOption.speed; // kW

    // Calculate estimated charging time & cost
    const estimatedChargingTime = estimatedBatteryCapacity / chargerSpeed; // in hours
    const unitRate = 400; // Rs per hour
    const estimatedCost = estimatedChargingTime * unitRate;

    // Auto-increment Booking ID
    const latestBooking = await Booking.find().sort({ bookingId: -1 }).limit(1);
    let bookingId;
    if (latestBooking.length === 0) {
      bookingId = "EV0001";
    } else {
      const currentBookingId = latestBooking[0].bookingId;
      const numberString = currentBookingId.replace("EV", "");
      const number = parseInt(numberString);
      const newNumber = (number + 1).toString().padStart(4, "0");
      bookingId = "EV" + newNumber;
    }

    // Create booking
    const booking = await Booking.create({
      bookingId,
      user,
      port: portId,
      vehicleType,
      vehicleModel,
      chargerType,
      bookingDate,
      timeSlot: `${startHour}:00-${startHour + hoursNeeded}:00`,
      estimatedBatteryCapacity,
      estimatedChargingTime,
      estimatedCost,
      startTime,
      endTime,
      paymentStatus: "pending"
    });

    res.status(201).json({ message: "Booking Confirmed", booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// ---------------------------
// Get bookings for a user
// ---------------------------
export async function getUserBookings(req, res) {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ user: userId })
      .populate("port", "portNumber location coordinates chargerOptions")
      .sort({ bookingDate: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// ---------------------------
// Get all bookings (admin)
// ---------------------------
export async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("port", "portNumber location")
      .sort({ bookingDate: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
