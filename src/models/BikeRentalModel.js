import mongoose from "mongoose";

const BikeRentalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        stationId_start: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true,
        },
        stationId_end: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            default: null,
        },
        startTime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endTime: {
            type: Date,
            default: null,
        },
        isReturned: {
            type: Boolean,
            default: false,
        },
        qrCodeData: {
            type: String,
            required: true,
        },
        bikeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bike",
            required: true,
        },
        duration: {
            type: Number, // dakika
        },
        totalFee: {
            type: Number, // opsiyonel ücret hesaplama
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
);

export default mongoose.models.BikeRental ||
    mongoose.model("BikeRental", BikeRentalSchema);
