import Booking from "../models/booking.js";
import Port from "../models/port.js";
import multer from "multer";

// Multer setup
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export async function createBooking(req, res) {
  try {
    if (req.user.role !== "customer") {
    res.status(403).json({
      message: "Please login as customer to create booking"
    });
    return;
  }

    const { portId, vehicleType, vehicleModel, chargerType, bookingDate, bookingTime } = req.body;
    const carPhoto = req.file; // optional

    if (!portId || !bookingDate || !bookingTime || !chargerType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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

    const portData = await Port.findOne({ portId });
    if (!portData) {
      return res.status(404).json({ message: "Port not found" });
    }

    const existingBooking = await Booking.findOne({ portId, bookingDate, bookingTime });
    if (existingBooking) {
      return res.status(400).json({ message: "Port already booked for this time slot" });
    }

    const newBooking = new Booking({
      bookingId,
      name: req.user.name,
      email: req.user.email,
      portId,
      vehicleType,
      vehicleModel,
      chargerType,
      carPhoto: carPhoto ? carPhoto.buffer : null,
      bookingDate,
      bookingTime,
      estimatedBatteryCapacity: req.body.estimatedBatteryCapacity,
      estimatedChargingTime: req.body.estimatedChargingTime,
      estimatedCost: req.body.estimatedCost
    });

    await newBooking.save();

    portData.status = "booked";
    await portData.save();

    res.status(201).json({ message: "Booking successful", booking: newBooking });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
}


export async function getBookings(req, res) {
  try {
    let bookings;

    if (req.user.role === "admin") {
      // Admin sees all bookings
      bookings = await Booking.find();
    } else if (req.user.role === "customer") {
      // Customers see only their own bookings (based on email or userId)
      bookings = await Booking.find({ email: req.user.email });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function cancelBooking(req, res) {
  try {
    // check role
    if (!req.user || req.user.role !== "customer") {
      return res
        .status(403)
        .json({ message: "Please login as customer to cancel booking" });
    }

    const { bookingId } = req.params; // bookingId from URL

    if (!bookingId) {
      return res.status(400).json({ message: "Missing booking ID" });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // delete booking
    await Booking.deleteOne({ bookingId });

    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ message: "Server error" });
  }
}