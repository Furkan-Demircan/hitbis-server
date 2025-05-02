import { ErrorResponse } from "../helpers/responseHelper.js";
import stationPocketService from "../services/stationPocketService.js";

const createPocket = async (req, res) => {
    const userId = req.user.userId;
    const stationPocketData = req.body;

    if (!userId) {
        return new ErrorResponse(401, "Unauthorized", null);
    }

    var result = await stationPocketService.createPocket(
        stationPocketData,
        userId
    );
    return res.json(result);
};

const getPocketByQRCode = async (req, res) => {
    const userId = req.user?.userId;
    const { slotCode } = req.query;

    if (!userId) {
        return res.json(new ErrorResponse(401, "Unauthorized", null));
    }

    if (!slotCode) {
        return res.json(new ErrorResponse(400, "Missing slotCode", null));
    }

    const result = await stationPocketService.getPocketByQRCode(slotCode);
    return res.json(result);
};

const onRFIDDetected = async (req, res) => {
    const { slotCode, rfidTag } = req.body;

    if (!slotCode || !rfidTag) {
        return res.json(
            new ErrorResponse(400, "Missing slotCode or rfidTag", null)
        );
    }

    const result = await stationPocketService.onRFIDDetected(slotCode, rfidTag);
    return res.json(result);
};

const clearPocket = async (req, res) => {
    const { pocketId } = req.body;

    if (!pocketId) {
        return new ErrorResponse(400, "Missing pocketId");
    }

    var result = await stationPocketService.clearPocket(pocketId);
    return res.json(result);
};

const getPocketStatus = async (req, res) => {
    const { stationId } = req.query;

    if (!stationId) {
        return res.json(new ErrorResponse(400, "Missing stationId", null));
    }

    const result = await stationPocketService.getPocketStatus(stationId);
    return res.json(result);
};

export default {
    createPocket,
    getPocketByQRCode,
    onRFIDDetected,
    clearPocket,
    getPocketStatus,
};
