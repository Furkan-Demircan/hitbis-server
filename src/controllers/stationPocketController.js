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

export default { createPocket, getPocketByQRCode };
