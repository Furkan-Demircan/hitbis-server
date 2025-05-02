import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import StationPocketModel from "../models/StationPocketModel.js";
import UserModel from "../models/UserModel.js";
import BikeRentalModel from "../models/BikeRentalModel.js";
import BikeModel from "../models/BikeModel.js";
import StationModel from "../models/StationModel.js";

//ADMIN ONLY
const createPocket = async (pocketData, userId) => {
    try {
        const isAdmin = await UserModel.findOne({ _id: userId, role: "admin" });
        if (!isAdmin) {
            return new ErrorResponse(403, "Only admins can create pockets");
        }

        const station = await StationModel.findById(pocketData.stationId);
        if (!station) {
            return new ErrorResponse(404, "Station not found");
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

//USER ONLY
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

const onRFIDDetected = async (slotCode, rfidTag) => {
    try {
        // 1. Cebi bul
        const pocket = await StationPocketModel.findOne({ slotCode });
        if (!pocket) {
            return new ErrorResponse(404, "Pocket not found");
        }

        // 2. Bisikleti RFID ile bul
        const bike = await BikeModel.findOne({ rfidTag });
        if (!bike) {
            return new ErrorResponse(404, "Bike not found for given RFID");
        }

        // 3. Aktif kiralama var mı?
        const rental = await BikeRentalModel.findOne({
            bikeId: bike._id,
            isReturned: false,
        });

        if (!rental) {
            return new ErrorResponse(
                400,
                "No active rental found for this bike"
            );
        }

        // 4. Kiralama güncelle → iade et
        const endTime = new Date();
        const durationMinutes = Math.ceil(
            (endTime - rental.startTime) / (1000 * 60)
        );
        const fee = durationMinutes * 0.5; // örnek: 0.5 ₺/dk

        rental.endTime = endTime;
        rental.duration = durationMinutes;
        rental.totalFee = fee;
        rental.stationId_end = pocket.stationId;
        rental.isReturned = true;
        await rental.save();

        // 5. Cebe bisikleti ata
        pocket.bikeId = bike._id;
        pocket.isOccupied = true;
        await pocket.save();

        // 6. Bisiklet müsait hale gelsin
        bike.isAvailable = true;
        await bike.save();

        return new SuccessResponse(
            {
                rentalId: rental._id,
                duration: durationMinutes,
                totalFee: fee,
                returnedAt: endTime,
                pocket: pocket.slotCode,
            },
            "Bike successfully returned",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "RFID return failed", error);
    }
};

const clearPocket = async (pocketId) => {
    try {
        const pocket = await StationPocketModel.findById(pocketId);

        if (!pocket) {
            return new ErrorResponse(404, "Pocket not found");
        }

        if (!pocket.isOccupied || !pocket.bikeId) {
            return new ErrorResponse(400, "Pocket is already empty");
        }

        pocket.bikeId = null;
        pocket.isOccupied = false;
        await pocket.save();

        return new SuccessResponse(pocket, "Pocket cleared successfully", null);
    } catch (error) {
        return new ErrorResponse(500, "Failed to clear pocket", error);
    }
};

const getPocketStatus = async (stationId) => {
    try {
        const pockets = await StationPocketModel.find({ stationId }).select(
            "slotCode isOccupied"
        );

        if (!pockets || pockets.length === 0) {
            return new ErrorResponse(404, "No pockets found for this station");
        }

        return new SuccessResponse(
            pockets,
            "Pocket status retrieved successfully",
            pockets.length
        );
    } catch (err) {
        return new ErrorResponse(500, "Failed to retrieve pocket status", err);
    }
};

export default {
    createPocket,
    getPocketByQRCode,
    onRFIDDetected,
    clearPocket,
    getPocketStatus,
};
