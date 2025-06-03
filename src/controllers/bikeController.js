import bikeService from "../services/bikeService.js";
import { ErrorResponse } from "../helpers/responseHelper.js";

const createBike = async (req, res) => {
    const bikeData = req.body;
    const userId = req.user.userId;

    if (!bikeData.bikeCode || !bikeData.rfidTag) {
        return new ErrorResponse("Bike code and RFID tag are required", 400);
    }
    var result = await bikeService.createBike(bikeData, userId);
    return res.json(result);
};

const getBikeDetails = async (req, res) => {
    const bikeId = req.query.bikeId;

    if (!bikeId) {
        return new ErrorResponse("Bike ID is required", 400);
    }

    var result = await bikeService.getBikeDetails(bikeId);
    return res.json(result);
};

const rfidReturnBike = async (req, res) => {
    const rfidTag = req.body.rfidTag;

    if (!rfidTag) {
        return new ErrorResponse("RFID tag is required", 400);
    }

    const slotCode = req.body.slotCode;
    if (!slotCode) {
        return new ErrorResponse("Slot code is required", 400);
    }

    var result = await bikeService.rfidReturnBike(rfidTag, slotCode);
    res.json(result);
};

export default { createBike, getBikeDetails, rfidReturnBike };
