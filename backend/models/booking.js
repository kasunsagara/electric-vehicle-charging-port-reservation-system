import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  user: {                                  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  port: {                                  
    type: mongoose.Schema.Types.ObjectId,
    ref: "Port",
    required: true
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
  carPhoto: {                      
    type: String,
    required: false
  },
  bookingDate: {              
    type: Date,
    required: true
  },
  timeSlot: {                      
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
  },
  paymentStatus: {                    
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  createdAt: {                       
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
