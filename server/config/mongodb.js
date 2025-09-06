import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI+"whispervault");
        console.log(`MongoDB connection established successfully`);
    } catch (error) {
        console.log('Database Connection error');
    }
}

export default connectDB;