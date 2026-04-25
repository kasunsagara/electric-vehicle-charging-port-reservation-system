import axios from "axios";

export const sendSMS = async (number, booking) => {
  try {
    const API_URL = process.env.SMS_API_URL;
    const API_KEY = process.env.SMS_API_KEY;

    const formattedNumber = `+94${number.substring(1)}`;

    const message = `
Booking Confirmed!

Booking ID: ${booking.bookingId}
Port ID: ${booking.portId}
Date: ${booking.bookingDate}
Time: ${booking.bookingTime}

Thank you for using EV Charging System.
    `;

    const request_url = `${API_URL}?key=${API_KEY}&number=${encodeURIComponent(
      formattedNumber
    )}&message=${encodeURIComponent(
      message
    )}&option=1&type=sms&prioritize=0`;

    const response = await axios.get(request_url);

    console.log("SMS sent successfully");
  } catch (error) {
    console.error("SMS sending failed:", error.message);
  }
};