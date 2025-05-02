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

export default { createBike, getBikeDetails };
