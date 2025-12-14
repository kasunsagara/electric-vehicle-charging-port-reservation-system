import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import portRouter from './routes/portRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import feedbackRouter from "./routes/feedbackRouter.js"; 

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

const mongoUrl = process.env.MONGO_DB_URI;

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(token);

  if (token != null) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
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
app.use("/api/feedbacks", feedbackRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
