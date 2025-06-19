import ActivityModel from "../models/ActivityModel.js";
import UserModel from "../models/UserModel.js";
import { SuccessResponse, ErrorResponse } from "../helpers/responseHelper.js";

const logActivity = async (userId, activityData) => {
    try {
        const requiredFields = [
            "name",
            "startTime",
            "endTime",
            "duration",
            "distance",
            "difficulty",
            "avgSpeed",
            "burnedCalories",
            "encodedPolyline",
        ];

        for (const field of requiredFields) {
            if (!activityData[field]) {
                return new ErrorResponse(400, `Missing field: ${field}`);
            }
        }

        const activity = await ActivityModel.create({
            userId,
            name: activityData.name,
            description: activityData.description || "",
            routeId: activityData.routeId || null,
            startTime: new Date(activityData.startTime),
            endTime: new Date(activityData.endTime),
            duration: activityData.duration,
            difficulty: activityData.difficulty || "Medium",
            distance: activityData.distance,
            avgSpeed: activityData.avgSpeed,
            elevationGain: activityData.elevationGain,
            burnedCalories: activityData.burnedCalories,
            encodedPolyline: activityData.encodedPolyline,
        });

        return new SuccessResponse(activity, "Activity logged successfully");
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
    }
};

const getActivitiyById = async (userId, activityId) => {
    try {
        const activity = await ActivityModel.findOne({
            userId,
            _id: activityId,
        });

        if (!activity) {
            return new ErrorResponse(404, "Activity not found");
        }

        return new SuccessResponse(
            activity,
            "Activity retrieved successfully",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
    }
};

const getUserActivities = async (userId) => {
    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return new ErrorResponse(404, "User not found");
        }

        const activities = await ActivityModel.find({ userId });
        if (!activities || activities.length === 0) {
            return new ErrorResponse(404, "No activities found");
        }

        return new SuccessResponse(
            activities,
            "Activities retrieved successfully",
            activities.length
        );
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
    }
};

const getActivitySummary = async (userId) => {
    try {
        const activities = await ActivityModel.find({ userId });

        if (!activities || activities.length === 0) {
            return new SuccessResponse(
                {
                    totalActivities: 0,
                    totalDistance: 0,
                    totalDuration: 0,
                    totalCalories: 0,
                    averageSpeed: 0,
                },
                "No activities found",
                null
            );
        }

        const summary = {
            totalActivities: activities.length,
            totalDistance: 0,
            totalDuration: 0,
            totalCalories: 0,
            averageSpeed: 0,
        };

        let speedSum = 0;

        activities.forEach((act) => {
            summary.totalDistance += act.distance || 0;
            summary.totalDuration += act.duration || 0;
            summary.totalCalories += act.burnedCalories || 0;
            speedSum += act.avgSpeed || 0;
        });

        summary.averageSpeed = parseFloat(
            (speedSum / activities.length).toFixed(2)
        );
        summary.totalDistance = parseFloat(summary.totalDistance.toFixed(2));
        summary.totalCalories = parseInt(summary.totalCalories);
        summary.totalDuration = parseInt(summary.totalDuration);

        return new SuccessResponse(summary, "Activity summary retrieved", null);
    } catch (error) {
        return new ErrorResponse(
            500,
            "Failed to retrieve activity summary",
            error
        );
    }
};

const deleteActivity = async (userId, activityId) => {
    try {
        const activity = await ActivityModel.findOneAndDelete({
            userId,
            _id: activityId,
        });

        if (!activity) {
            return new ErrorResponse(404, "Activity not found");
        }

        return new SuccessResponse(
            activity,
            "Activity deleted successfully",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "Something went wrong", error);
    }
};

export default {
    logActivity,
    getUserActivities,
    getActivitiyById,
    getActivitySummary,
    deleteActivity,
};
