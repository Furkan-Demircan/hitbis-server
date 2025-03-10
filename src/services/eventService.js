import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import GroupModel from "../models/GroupModel.js";
import GroupItemModel from "../models/GroupItemModel.js";
import EventModel from "../models/EventModel.js";

const createEvent = async (groupId, adminId, eventData) => {
    try {
        const group = await GroupModel.findOne({ _id: groupId });
        const existingAdmin = await GroupItemModel.findOne({
            groupId: groupId,
            userId: adminId,
            isAdmin: true,
        });

        if (!existingAdmin) {
            return new ErrorResponse(401, "You do not have permission");
        }

        if (!group) {
            return new ErrorResponse(404, "Group not found");
        }

        const createResult = await EventModel.create(eventData);
        return new SuccessResponse(createResult, "Event created", null);
    } catch {
        return new ErrorResponse(500, "Something went wrong");
    }
};

export default {
    createEvent,
};
