import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        avatar: {
            type: String,
            default:
                "https://res.cloudinary.com/dqj0xg1zv/image/upload/v1698236482/avatars/default-avatar.png",
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        surname: { type: String },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
        },
        weight: {
            type: Number,
        },
        lenght: {
            type: Number,
        },
        isSignUpComplete: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    { timestamps: true, collection: "users" }
);

export default mongoose.model("User", userSchema);
