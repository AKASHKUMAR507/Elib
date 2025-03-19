import mongoose, { } from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        await mongoose.connect(config.dbUrl as string);

        mongoose.connection.on('connected', () => {
            console.log(`MongoDB Connection Established:- Database: ${mongoose.connection.name}- Host: ${mongoose.connection.host}`);
        })

        mongoose.connection.on('error', (error) => {
            console.error('Error connecting to MongoDB:', error);
        })

        console.log(`MongoDB Connection Established:- Database: ${mongoose.connection.name}- Host: ${mongoose.connection.host}`)

    } catch (error) {
        console.error('Failed to connect MongoDB:', error);
        process.exit(1)
    }
}

export default connectDB;