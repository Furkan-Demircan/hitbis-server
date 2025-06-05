import { ErrorResponse, SuccessResponse } from "../helpers/responseHelper.js";
import RouteModel from "../models/RouteModel.js";
import UserModel from "../models/UserModel.js";
const createRoute = async (routeData, userId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return new ErrorResponse(404, "User Not Found", null);
        }

        if (!routeData) {
            return new ErrorResponse(400, "Route Data Not Found", null);
        }
        console.log(routeData);

        const createdRoute = await RouteModel.create({
            ...routeData,
            userId: userId,
        });

        return new SuccessResponse(
            createdRoute,
            "Route Created Successfully",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "Something Went Wrong", error);
    }
};

const getRoutesByUser = async (userId) => {
    try {
        if (!userId) {
            return new ErrorResponse(404, "User Not Found", null);
        }

        const routes = await RouteModel.find({ userId: userId });

        if (!routes || routes.length === 0) {
            return new ErrorResponse(404, "No Routes Found", null);
        }

        return new SuccessResponse(
            routes,
            "Routes Retrieved Successfully",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "Something Went Wrong", error);
    }
};

const getPublicRoutes = async () => {
    try {
        const routes = await RouteModel.find({ isPublic: true });

        if (!routes || routes.length === 0) {
            return new ErrorResponse(404, "No Public Routes Found", null);
        }

        return new SuccessResponse(
            routes,
            "Public Routes Retrieved Successfully",
            routes.length
        );
    } catch (error) {
        return new ErrorResponse(500, "Something Went Wrong", error);
    }
};

const getRouteDetails = async (routeId) => {
    try {
        if (!routeId) {
            return new ErrorResponse(404, "Route ID Not Found", null);
        }

        const route = await RouteModel.findById(routeId).populate(
            "userId",
            "name surname username"
        );

        if (!route) {
            return new ErrorResponse(404, "Route Not Found", null);
        }

        return new SuccessResponse(
            route,
            "Route Details Retrieved Successfully",
            null
        );
    } catch (error) {
        return new ErrorResponse(500, "Something Went Wrong", error);
    }
};

const deleteRoute = async (routeId, userId) => {
    try {
        if (!userId) {
            return new ErrorResponse(404, "User Not Found", null);
        }

        if (!routeId) {
            return new ErrorResponse(404, "Route ID Not Found", null);
        }

        const route = await RouteModel.findOneAndDelete({
            _id: routeId,
            userId: userId,
        });

        if (!route) {
            return new ErrorResponse(404, "Route Not Found", null);
        }

        return new SuccessResponse(route, "Route Deleted Successfully", null);
    } catch (error) {
        return new ErrorResponse(500, "Something Went Wrong", error);
    }
};

const updateRoute = async (routeId, updateData, userId) => {
    try {
        const route = await RouteModel.findOne({
            _id: routeId,
            userId: userId,
        });

        if (!route) {
            return new ErrorResponse(404, "Route not found");
        }

        const updated = await RouteModel.findByIdAndUpdate(
            routeId,
            { $set: updateData },
            { new: true }
        );

        return new SuccessResponse(updated, "Route updated successfully", null);
    } catch (error) {
        return new ErrorResponse(500, "Internal Server Error", error);
    }
};

const searchRoutes = async (keyword) => {
    try {
        if (!keyword || keyword.trim() === "") {
            return new ErrorResponse(400, "Search keyword is required");
        }

        const regex = new RegExp(keyword, "i"); // case-insensitive

        const routes = await RouteModel.find({
            isPublic: true,
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
            ],
        });

        if (!routes || routes.length === 0) {
            return new ErrorResponse(404, "No routes matched your search");
        }

        return new SuccessResponse(
            routes,
            "Search results retrieved",
            routes.length
        );
    } catch (error) {
        return new ErrorResponse(500, "Internal Server Error", error);
    }
};

export default {
    createRoute,
    getRoutesByUser,
    getPublicRoutes,
    getRouteDetails,
    deleteRoute,
    searchRoutes,
    updateRoute,
};
