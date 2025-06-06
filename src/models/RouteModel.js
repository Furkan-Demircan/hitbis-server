import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        waypoints: [
            {
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
            },
        ],
        distance: {
            type: Number, // km
        },
        elevationGain: {
            type: Number, // metre
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
        },
        estimatedTime: {
            type: String, // dakika
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        polyline: {
            type: String, // Polyline encoded string
            required: true,
        },
    },
    { versionKey: false }
);

export default mongoose.model("Route", RouteSchema);
