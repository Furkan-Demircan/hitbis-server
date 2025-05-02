import mongoose from "mongoose";

const StationPocketSchema = new mongoose.Schema(
    {
        stationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true,
        },
        slotCode: {
            type: String,
            required: true,
            unique: true, // QR ile eşleşecek değer
        },
        bikeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bike",
            default: null, // boşsa cep boştur
        },
        isOccupied: {
            type: Boolean,
            default: false,
        },
        isOperational: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
);

export default mongoose.models.StationSlot ||
    mongoose.model("StationSlot", StationPocketSchema);
