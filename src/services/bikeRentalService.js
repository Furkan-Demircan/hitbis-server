import BikeRentalModel from "../models/BikeRentalModel.js";
import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import StationPocketModel from "../models/StationPocketModel.js";
import BikeModel from "../models/BikeModel.js";
import stationPocketService from "./stationPocketService.js";

const rentBike = async (slotCode, userId) => {
    try {
        const pocket = await StationPocketModel.findOne({ slotCode });

        if (!pocket) {
            return new ErrorResponse(404, "Slot not found");
        }

        const activeRental = await BikeRentalModel.findOne({
            userId: userId,
            isReturned: false,
        });

        if (activeRental) {
            return new ErrorResponse(400, "You already have an active rental");
        }

        const bike = await BikeModel.findById(pocket.bikeId);
        if (!bike || !bike.isAvailable) {
            return new ErrorResponse(404, "Bike not found");
        }

        const rental = await BikeRentalModel.create({
            userId: userId,
            bikeId: pocket.bikeId,
            stationId_start: pocket.stationId,
            startTime: new Date(),
            isReturned: false,
            qrCodeData: slotCode,
        });

        if (!rental) {
            return new ErrorResponse(500, "Failed to create rental record");
        }

        await stationPocketService.unlockPocket(slotCode);

        pocket.bikeId = null;
        pocket.isOccupied = false;
        await pocket.save();

        bike.isAvailable = false;
        await bike.save();

        return new SuccessResponse(
            {
                rentalId: rental._id,
                bikeCode: bike.bikeCode,
                startTime: rental.startTime,
                fromStation: pocket.stationId,
                slotCode: slotCode,
            },
            "Bike rented successfully",
            null
        );
    } catch (err) {
        console.log(err);
        return new ErrorResponse(
            500,
            "Something went wrong while renting the bike"
        );
    }
};

const getRentalHistory = async (userId) => {
    try {
        const rentals = await BikeRentalModel.find({ userId: userId })
            .populate("bikeId")
            .populate("stationId_start")
            .populate("stationId_end")
            .sort({ startTime: -1 });

        if (!rentals || rentals.length === 0) {
            return new ErrorResponse(404, "No rental history found");
        }

        return new SuccessResponse(
            rentals,
            "Rental history retrieved successfully",
            null
        );
    } catch (err) {
        console.log(err);
        return new ErrorResponse(
            500,
            "Something went wrong while retrieving rental history"
        );
    }
};

const getCurrentRentalStatus = async (userId) => {
    try {
        const rental = await BikeRentalModel.findOne({
            userId: userId,
            isReturned: false,
        })
            .populate("bikeId")
            .populate("stationId_start")
            .populate("stationId_end");

        if (!rental) {
            return new ErrorResponse(404, "No active rental found");
        }

        return new SuccessResponse(
            rental,
            "Current rental status retrieved successfully",
            null
        );
    } catch (err) {
        console.log(err);
        return new ErrorResponse(
            500,
            "Something went wrong while retrieving current rental status"
        );
    }
};

export default {
    rentBike,
    getRentalHistory,
    getCurrentRentalStatus,
};
