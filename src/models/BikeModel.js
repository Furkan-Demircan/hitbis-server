import mongoose from "mongoose";

const BikeSchema = new mongoose.Schema(
    {
        bikeCode: {
            type: String,
            required: true,
            unique: true,
        },
        stationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            default: null,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        rfidTag: {
            type: String,
            required: true,
            unique: true,
        },
        lastMaintenanceDate: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { versionKey: false }
);

export default mongoose.model("Bike", BikeSchema);
