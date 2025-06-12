import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("DAta base connected successfully")
    } catch (error) {
        console.log("error while connecting database");

    }
}

export default connectDB;