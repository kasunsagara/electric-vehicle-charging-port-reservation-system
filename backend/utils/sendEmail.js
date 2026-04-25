import nodemailer from "nodemailer";

export const sendEmail = async (to, booking) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"EV Charging System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "EV Charging Booking Confirmation",
      text: `
Booking Confirmed Successfully!

Dear Customer,

Your EV charging slot has been successfully booked.

Booking Details
- Booking ID: ${booking.bookingId}
- Port ID: ${booking.portId}
- Date: ${booking.bookingDate}
- Time: ${booking.bookingTime}

Vehicle Details
- Vehicle Type: ${booking.vehicleType || "N/A"}
- Vehicle Model: ${booking.vehicleModel || "N/A"}
- Charger Type: ${booking.chargerType}

Estimated Details
- Battery Capacity: ${booking.estimatedBatteryCapacity || "N/A"} kWh
- Charging Time: ${booking.estimatedChargingTime || "N/A"} hours
- Estimated Cost: Rs. ${booking.estimatedCost || "N/A"}

Please arrive on time for your selected slot.

Thank you for using EV Charging System.
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};