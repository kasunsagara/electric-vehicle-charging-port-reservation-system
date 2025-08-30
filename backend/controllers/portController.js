import Port from '../models/port.js';

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
        const ports = await Port.find();
        res.status(200).json({
            message: "Ports retrieved successfully",
            data: ports
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve ports"
        });
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
