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
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
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
        },
        avgSpeed: {
            type: Number, // km/h
        },
        elevationGain: {
            type: Number, // metre
        },
        burnedCalories: {
            type: Number,
        },
        gpsTrack: [
            {
                lat: Number,
                lng: Number,
                timestamp: Date,
            },
        ],
        heartRateData: [
            {
                bpm: Number,
                timestamp: Date,
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
);

export default mongoose.model("Activity", ActivitySchema);
