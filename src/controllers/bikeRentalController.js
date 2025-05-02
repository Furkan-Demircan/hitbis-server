import bikeRentalService from "../services/bikeRentalService.js";
import { ErrorResponse } from "../helpers/responseHelper.js";

const rentBike = async (req, res) => {
    const userId = req.user.userId;
    const slotCode = req.body.slotCode;

    if (!userId) {
        return new ErrorResponse(400, "User ID is required");
    }

    if (!slotCode) {
        return new ErrorResponse(400, "Slot code is required");
    }

    var result = await bikeRentalService.rentBike(slotCode, userId);

    return res.json(result);
};

const getRentalHistory = async (req, res) => {
    const userId = req.user.userId;

    if (!userId) {
        return new ErrorResponse(400, "User ID is required");
    }

    var result = await bikeRentalService.getRentalHistory(userId);

    return res.json(result);
};

const getCurrentRentalStatus = async (req, res) => {
    const userId = req.user.userId;

    if (!userId) {
        return new ErrorResponse(400, "User ID is required");
    }

    var result = await bikeRentalService.getCurrentRentalStatus(userId);

    return res.json(result);
};

export default { rentBike, getRentalHistory, getCurrentRentalStatus };
