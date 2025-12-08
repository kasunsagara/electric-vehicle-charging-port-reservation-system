import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  portId: {
    type: String,
    required: true
  },
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  vehicleType: {
    type: String,
    required: false
  },
  vehicleModel: {                         
    type: String,
    required: false
  },
  chargerType: {                       
    type: String,
    enum: ["normal", "fast"],
    required: true
  },
  bookingDate: {              
    type: Date,
    required: true
  },
  bookingTime: {
    type: String,
    required: true
  },
  estimatedBatteryCapacity: {        
    type: Number
  },
  estimatedChargingTime: {             
    type: Number
  },
  estimatedCost: {                     
    type: Number
  }
});

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
