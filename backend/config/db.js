import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_DB_URI;
        await mongoose.connect(mongoUrl);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

export default connectDB;