import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route",
            default: null,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number, // dakika
            required: true,
        },
        distance: {
            type: Number, // km
            required: true,
        },
        avgSpeed: {
            type: Number, // km/h
            required: true,
        },
        elevationGain: {
            type: Number, // metre
            required: false,
        },
        burnedCalories: {
            type: Number,
            required: true,
        },
        encodedPolyline: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Activity", ActivitySchema);
