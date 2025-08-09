import mongoose from "mongoose";

const portSchema = mongoose.Schema({
  portNumber: {
     type: Number,
     required: true,
     unique: true
   },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available",
  }
});

const Port = mongoose.model("ports", portSchema);

export default Port;
