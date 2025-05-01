import stationService from "../services/stationService.js";
import { ErrorResponse } from "../helpers/responseHelper.js";

const createStation = async (req, res) => {
    const userId = req.user.userId;
    const stationData = req.body;

    if (!userId) {
        return new ErrorResponse(401, "Unauthorized", null);
    }

    var result = await stationService.createStation(stationData, userId);
    return res.json(result);
};

const getAllStations = async (req, res) => {
    var result = await stationService.getAllStations();
    return res.json(result);
};

const getStationDetails = async (req, res) => {
    const stationId = req.query.stationId;
    if (!stationId) {
        return new ErrorResponse(400, "Station ID is required", null);
    }
    var result = await stationService.getStationDetails(stationId);

    return res.json(result);
};

const getStationCapacityStatus = async (req, res) => {
    const stationId = req.query.stationId;
    if (!stationId) {
        return new ErrorResponse(400, "Station ID is required", null);
    }
    var result = await stationService.getStationCapacityStatus(stationId);

    return res.json(result);
};

const updateStation = async (req, res) => {
    const userId = req.user.userId;
    const stationId = req.query.stationId;
    const stationData = req.body;

    if (!userId) {
        return new ErrorResponse(401, "Unauthorized", null);
    }

    if (!stationId) {
        return new ErrorResponse(400, "Station ID is required", null);
    }

    var result = await stationService.updateStation(
        stationId,
        stationData,
        userId
    );
    return res.json(result);
};

const deleteStation = async (req, res) => {
    const userId = req.user.userId;
    const stationId = req.query.stationId;
    if (!stationId) {
        return new ErrorResponse(400, "Station ID is required", null);
    }
    var result = await stationService.deleteStation(stationId, userId);
    return res.json(result);
};

export default {
    createStation,
    getAllStations,
    getStationDetails,
    getStationCapacityStatus,
    updateStation,
    deleteStation,
};
