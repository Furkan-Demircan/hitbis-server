import BikeModel from "../models/BikeModel.js";
import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import UserModel from "../models/UserModel.js";

const createBike = async (bikeData, userId) => {
    try {
        const isAdmin = await UserModel.findOne({
            _id: userId,
            role: "admin",
        });

        if (!isAdmin) {
            return new ErrorResponse(403, "Only admins can create bikes");
        }

        const bikeExists = await BikeModel.findOne({
            $or: [
                { bikeCode: bikeData.bikeCode },
                { rfidTag: bikeData.rfidTag },
            ],
        });

        if (bikeExists) {
            return new ErrorResponse(
                400,
                "Bike with this code or RFID tag already exists"
            );
        }
        const bike = await BikeModel.create(bikeData);

        return new SuccessResponse(bike, "Bike created successfully", null);
    } catch (err) {
        console.error(err);
        return new ErrorResponse(500, "Error creating bike");
    }
};

const getBikeDetails = async (bikeId) => {
    const bike = await BikeModel.findOne({
        _id: bikeId,
    });

    if (!bike) {
        return new ErrorResponse(404, "Bike not found");
    }

    return new SuccessResponse(
        bike,
        "Bike details retrieved successfully",
        null
    );
};

export default { createBike, getBikeDetails };
