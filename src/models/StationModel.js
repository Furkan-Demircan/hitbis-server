import mongoose from "mongoose";

const StationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        capacity: {
            type: Number,
            required: true,
        },
        currentBikeCount: {
            type: Number,
            default: 0,
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

export default mongoose.model("Station", StationSchema);
