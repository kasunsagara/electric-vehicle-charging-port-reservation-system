import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("authorization")?.replace("Bearer ", "");

        if (token != null) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded) {
                req.user = decoded;
            }
        }

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        next();
    }
};

export default authMiddleware;