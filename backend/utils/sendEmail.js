import nodemailer from "nodemailer";

export const sendEmail = async (to, booking) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"EV Charging System" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "EV Charging Booking Confirmation",
      html: `
        <h2>Booking Confirmed Successfully</h2>

        <p>Dear Customer,</p>

        <p>Your EV charging slot has been successfully booked.</p>

        <h3>Booking Details</h3>
        <ul>
        <li><b>Booking ID:</b> ${booking.bookingId}</li>
        <li><b>Port ID:</b> ${booking.portId}</li>
        <li><b>Date:</b> ${booking.bookingDate}</li>
        <li><b>Time:</b> ${booking.bookingTime}</li>
        </ul>

        <h3>Vehicle Details</h3>
        <ul>
        <li><b>Vehicle Type:</b> ${booking.vehicleType || "N/A"}</li>
        <li><b>Vehicle Model:</b> ${booking.vehicleModel || "N/A"}</li>
        <li><b>Charger Type:</b> ${booking.chargerType}</li>
        </ul>

        <h3>Estimated Details</h3>
        <ul>
        <li><b>Battery Capacity:</b> ${booking.estimatedBatteryCapacity || "N/A"} kWh</li>
        <li><b>Charging Time:</b> ${booking.estimatedChargingTime || "N/A"} hours</li>
        <li><b>Estimated Cost:</b>  Rs. ${booking.estimatedCost || "N/A"}</li>
        </ul>

        <p>Please arrive on time for your selected slot.</p>

        <p>Thank you for using our EV Charging System</p>

        <p><b>This is an automated email. Please do not reply.</b></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};