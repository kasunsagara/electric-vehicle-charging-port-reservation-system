import express from "express";
import { createBooking, getUserBookings, getAllBookings } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// Create a new booking (user must be logged in)
bookingRouter.post("/", createBooking);

// Get bookings for logged-in user
bookingRouter.get("/:userId", getUserBookings);

// Get all bookings (admin only)
bookingRouter.get("/", getAllBookings);

export default bookingRouter;
