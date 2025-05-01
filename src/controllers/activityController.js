import activityService from "../services/activityService.js";
import { ErrorResponse } from "../helpers/responseHelper.js";

const logActivity = async (req, res) => {
    const userId = req.user.userId;
    const activityData = req.body;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Found"));
    }

    var result = await activityService.logActivity(userId, activityData);
    return res.json(result);
};

const getActivitiyById = async (req, res) => {
    const activityId = req.query.activityId;
    const userId = req.user.userId;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Found"));
    }

    var result = await activityService.getActivitiyById(userId, activityId);
    return res.json(result);
};

const getActivitySummary = async (req, res) => {
    const userId = req.user.userId;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Found"));
    }

    var result = await activityService.getActivitySummary(userId);
    return res.json(result);
};

const deleteActivity = async (req, res) => {
    const activityId = req.query.activityId;
    const userId = req.user.userId;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Found"));
    }

    var result = await activityService.deleteActivity(userId, activityId);
    return res.json(result);
};

export default {
    logActivity,
    getActivitiyById,
    getActivitySummary,
    deleteActivity,
};
