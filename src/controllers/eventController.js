import { ErrorResponse } from "../helpers/responseHelper.js";
import eventService from "../services/eventService.js";

const createEvent = async (req, res) => {
    const groupId = req.query.groupId;
    const adminId = req.user.userId;
    const eventData = req.body;

    if (!groupId) {
        return res.json(new ErrorResponse(404, "Group not found"));
    }

    var result = await eventService.createEvent(groupId, adminId, eventData);
    return res.json(result);
};

export default { createEvent };
