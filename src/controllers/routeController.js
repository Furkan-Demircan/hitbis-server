import { ErrorResponse } from "../helpers/responseHelper.js";
import routeService from "../services/routeService.js";

const createRoute = async (req, res) => {
    const routeData = req.body;
    const userId = req.user.userId;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Found"));
    }

    var result = await routeService.createRoute(routeData, userId);
    return res.json(result);
};

const getRoutesByUser = async (req, res) => {
    const userId = req.user.userId;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Found"));
    }

    var result = await routeService.getRoutesByUser(userId);
    return res.json(result);
};

const getPublicRoutes = async (req, res) => {
    var result = await routeService.getPublicRoutes();
    return res.json(result);
};

const getRouteDetails = async (req, res) => {
    const routeId = req.query.routeId;

    var result = await routeService.getRouteDetails(routeId);
    return res.json(result);
};

const updateRoute = async (req, res) => {
    const routeId = req.query.routeId;
    const routeData = req.body;
    const userId = req.user.userId;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Found"));
    }

    var result = await routeService.updateRoute(routeId, routeData, userId);
    return res.json(result);
};

const deleteRoute = async (req, res) => {
    const routeId = req.query.routeId;
    const userId = req.user.userId;

    if (!userId) {
        return res.json(new ErrorResponse(404, "User Not Found"));
    }

    var result = await routeService.deleteRoute(routeId, userId);
    return res.json(result);
};

const searchRoutes = async (req, res) => {
    const { q } = req.query;

    var result = await routeService.searchRoutes(q);
    return res.json(result);
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
