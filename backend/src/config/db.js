import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("..", ".env") });

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to database");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

export default connectToDB;
