import Port from '../models/port.js';
import Booking from '../models/booking.js';

export async function createPort(req, res) {
    try {
        if(req.user == null) {
            res.status(401).json({
                message: "You are not logged in"
            });
            return;
        }

        if(req.user.role != 'admin') {
            res.status(403).json({
                message: "You are not an admin"
            });
            return;
        }

        const port = new Port(req.body);
        await port.save();

        res.status(201).json({
            message: "Port created successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: "Port creation failed"
        });
    }
}

export async function getPorts(req, res) {
  try {
    const { date, time } = req.query; // Get date and time from query parameters

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }

    // Fetch all ports
    const ports = await Port.find();

    // Fetch bookings for the selected date and time
    const bookings = await Booking.find({
      bookingDate: new Date(date),
      bookingTime: time,
    });

    // Map ports to include dynamic status based on bookings
    const portsWithStatus = ports.map((port) => {
      // Check if the port is booked for the given date and time
      const isBooked = bookings.some((booking) => booking.portId === port.portId);
      return {
        ...port._doc, // Spread the port document
        status: isBooked ? 'booked' : 'available', // Override status based on booking
      };
    });

    res.status(200).json({
      message: "Ports retrieved successfully",
      data: portsWithStatus,
    });
  } catch (error) {
    console.error("Error fetching ports:", error);
    res.status(500).json({ message: "Failed to retrieve ports" });
  }
}

export async function getPortById(req, res) {
    try {
        const port = await Port.findOne({ portId: req.params.id });
        if (!port) return res.status(404).json({ message: "Port not found" });
        res.status(200).json(port);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve port" });
    }
}

export async function deletePort(req, res) {
  try {
    if (req.user == null) {
      res.status(401).json({ message: "You are not logged in" });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({ message: "You are not an admin" });
      return;
    }

    const portId = req.params.id; 
    
    const deletedPort = await Port.findOneAndDelete({ portId });

    if (!deletedPort) {
      return res.status(404).json({ message: "Port not found" });
    }

    res.status(200).json({ message: "Port deleted successfully" });

  } catch (error) {
    console.error("Error deleting port:", error);
    res.status(400).json({ message: "Port deletion failed" });
  }
}
