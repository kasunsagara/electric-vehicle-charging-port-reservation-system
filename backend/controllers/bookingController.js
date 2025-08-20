import Booking from "../models/booking.js";
import Port from "../models/port.js";

export async function createBooking(req, res) {
 
  if (req.user.role !== "customer") {
    res.status(403).json({
      message: "Please login as customer to create booking"
    });
    return;
  }

  try {
    const { user, port, vehicleType, vehicleModel, chargerType, photo, bookingDate, timeSlot } = req.body;

    if (!user || !port || !bookingDate || !timeSlot) {
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

    const portData = await Port.findById(port);
    if (!portData) {
      return res.status(404).json({ message: "Port not found" });
    }

    const existingBooking = await Booking.findOne({
      port,
      bookingDate,
      timeSlot,
      status: "booked"
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Port already booked for this time slot" });
    }

    const newBooking = new Booking({
      bookingId,
      user,
      port,
      vehicleType,
      vehicleModel,
      chargerType,
      photo,
      bookingDate,
      timeSlot,
      status: "booked"
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
