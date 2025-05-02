import mongoose from "mongoose";

const BikeSchema = new mongoose.Schema(
    {
        bikeCode: {
            type: String,
            required: true,
            unique: true,
        },
        rfidTag: {
            type: String,
            required: true,
            unique: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        description: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
);

export default mongoose.model("Bike", BikeSchema);
