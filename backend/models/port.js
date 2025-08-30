import mongoose from "mongoose";

const portSchema = mongoose.Schema({
  portId: {
    type: String,
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
    default: "available"
  },
  chargerOptions: [
    {
      type: { 
        type: String, 
        enum: ["normal", "fast"], 
        required: true 
      },
      speed: { 
        type: Number, 
        required: true 
      }
    }
  ]
});

const Port = mongoose.model("ports", portSchema);

export default Port;
