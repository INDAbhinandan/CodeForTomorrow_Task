import { mongoose, Schema } from "mongoose";
const userSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true,
        }
    }
)

export default mongoose.model("user", userSchema)