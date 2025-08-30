import express from "express";
import { createBooking, getBookings, cancelBooking, upload } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// Use multer middleware for handling file upload
bookingRouter.post("/", upload.single("carPhoto"), createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.delete("/:bookingId", cancelBooking);

export default bookingRouter;
