import StationModel from "../models/StationModel.js";
import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import UserModel from "../models/UserModel.js";
import StationPocketModel from "../models/StationPocketModel.js";

const createStation = async (stationData, userId) => {
    try {
        const isAdmin = await UserModel.findOne({ _id: userId, role: "admin" });
        if (!isAdmin) {
            return new ErrorResponse(403, "Only admins can create stations");
        }

        const exists = await StationModel.findOne({
            name: stationData.name,
        });

        if (exists) {
            return new ErrorResponse(400, "Station name already exists");
        }

        const newStation = await StationModel.create(stationData);

        return new SuccessResponse(
            newStation,
            "Station created successfully",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "Failed to create station", error);
    }
};

const getAllStations = async () => {
    try {
        const stations = await StationModel.find({});
        return new SuccessResponse(
            stations,
            "Stations retrieved successfully",
            stations.length
        );
    } catch (error) {
        return new ErrorResponse(500, "Failed to retrieve stations", error);
    }
};

const getStationDetails = async (stationId) => {
    try {
        const station = await StationModel.findById(stationId);
        if (!station) {
            return new ErrorResponse(404, "Station not found", null);
        }
        return new SuccessResponse(
            station,
            "Station details retrieved successfully",
            null
        );
    } catch (error) {
        return new ErrorResponse(
            500,
            "Failed to retrieve station details",
            error
        );
    }
};

const getStationCapacityStatus = async (stationId) => {
    try {
        const total = await StationPocketModel.countDocuments({ stationId });
        const occupied = await StationPocketModel.countDocuments({
            stationId,
            isOccupied: true,
        });
        const available = total - occupied;

        return new SuccessResponse(
            {
                stationId,
                totalSlots: total,
                occupiedSlots: occupied,
                availableSlots: available,
            },
            "Station slot status retrieved",
            null
        );
    } catch (err) {
        return new ErrorResponse(
            500,
            "Station capacity status check failed",
            err
        );
    }
};

const updateStation = async (stationId, updateData, userId) => {
    try {
        const isAdmin = await UserModel.findOne({
            _id: userId,
            role: "admin",
        });
        if (!isAdmin) {
            return new ErrorResponse(403, "Only admins can update stations");
        }

        const station = await StationModel.findById(stationId);

        if (!station) {
            return new ErrorResponse(404, "Station not found");
        }

        await StationModel.findByIdAndUpdate(stationId, { $set: updateData });

        return new SuccessResponse(null, "Station updated successfully", null);
    } catch (err) {
        return new ErrorResponse(500, "Failed to update station", err);
    }
};

const deleteStation = async (stationId, userId) => {
    try {
        const isAdmin = await UserModel.findOne({
            _id: userId,
            role: "admin",
        });

        if (!isAdmin) {
            return new ErrorResponse(403, "Only admins can delete stations");
        }

        const station = await StationModel.findById(stationId);

        if (!station) {
            return new ErrorResponse(404, "Station not found");
        }

        await StationModel.findByIdAndUpdate(stationId, { isActive: false });

        return new SuccessResponse(
            null,
            "Station deleted (soft) successfully",
            null
        );
    } catch (err) {
        return new ErrorResponse(500, "Failed to delete station", err);
    }
};

export default {
    createStation,
    getAllStations,
    getStationDetails,
    getStationCapacityStatus,
    updateStation,
    deleteStation,
};
