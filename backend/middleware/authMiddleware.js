import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export default function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token != null) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (!error) {
        req.user = decoded;
      }
    });
  }

  next();
};

