import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        avatar: {
            type: String,
            default:
                "https://res.cloudinary.com/dcjfzpzpb/image/upload/v1747907980/ZV9iYWNrZ3JvdW5kX3JlbW92YWwvZl9wbmc_gmdpvn_c_crop_w_430_h_430_ar_1_1_knwdrw.png",
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
