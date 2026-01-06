import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
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
};

