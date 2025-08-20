import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import userRouter from './routes/userRouter.js';
import portRouter from './routes/portRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import User from './models/user.js';
import Port from './models/port.js';
import Booking from './models/booking.js';

const app = express();

const mongoUrl = "mongodb+srv://kasunsagara689:56649901@cluster0.hulg4fz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl, {})
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("Database connected");
});

app.use(bodyParser.json());

app.use(
  (req, res, next) => {

    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);

    if (token != null) {
      jwt.verify(token, "20010924", (error, decoded) => {

        if (!error) {
          req.user = decoded;
        }

      });
    }

    next();

  });

app.use("/api/users", userRouter);
app.use("/api/ports", portRouter);
app.use("/api/bookings", bookingRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});







/* {
    "email": "kasunsagara689@gmail.com",
    "password": "80187968"
   } 

   {
    "email": "nimal@example.com",
    "password": "1234"
   } */