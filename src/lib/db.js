import mongoose from "mongoose";
import { CLIENT_URL, MONGO_URI } from "../../config/env.js";


export const connectDB = async () => {
  try {

    const conn = await mongoose.connect(MONGO_URI);
    console.log("Database connected:", conn.connection.host);
  } catch (err) {
    console.error("Error connecting to database:", err.message);
    process.exit(1);
  }
};