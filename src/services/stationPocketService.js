import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import StationPocketModel from "../models/StationPocketModel.js";
import UserModel from "../models/UserModel.js";

const createPocket = async (pocketData, userId) => {
    try {
        const isAdmin = await UserModel.findOne({ _id: userId, role: "admin" });
        if (!isAdmin) {
            return new ErrorResponse(403, "Only admins can create pockets");
        }

        const existing = await StationPocketModel.findOne({
            slotCode: pocketData.slotCode,
        });

        if (existing) {
            return new ErrorResponse(
                400,
                "Slot with this QR code already exists"
            );
        }

        const newPocket = await StationPocketModel.create({
            stationId: pocketData.stationId,
            slotCode: pocketData.slotCode,
            isOccupied: false,
            bikeId: null,
        });

        return new SuccessResponse(
            newPocket,
            "Pocket created successfully",
            null
        );
    } catch (err) {
        return new ErrorResponse(500, "Failed to create pocket", err);
    }
};

const getPocketByQRCode = async (slotCode) => {
    try {
        const pocket = await StationPocketModel.findOne({ slotCode });

        if (!pocket.isOccupied || !pocket.bikeId) {
            return new ErrorResponse(404, "This slot is currently empty");
        }

        if (!pocket) {
            return new ErrorResponse(
                404,
                "Pocket not found with given QR code"
            );
        }

        return new SuccessResponse(
            pocket,
            "Pocket retrieved successfully",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "Failed to retrieve pocket", error);
    }
};

export default { createPocket, getPocketByQRCode };
