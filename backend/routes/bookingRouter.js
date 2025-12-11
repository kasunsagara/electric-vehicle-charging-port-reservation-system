import express from "express";
import { createBooking, getBookings, cancelBooking } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.delete("/:bookingId", cancelBooking);

export default bookingRouter;
