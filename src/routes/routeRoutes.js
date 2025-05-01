import { Router } from "express";
import routeController from "../controllers/routeController.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";
import {
    createRouteValidation,
    updateRouteValidation,
} from "../validations/routeValidations.js";
import { validator } from "../middlewares/validator.js";

const routeRoutes = Router();

routeRoutes.post(
    "/create",
    validator(createRouteValidation),
    authenticateMiddleware,
    routeController.createRoute
);
routeRoutes.get("/my", authenticateMiddleware, routeController.getRoutesByUser);
routeRoutes.get("/public", routeController.getPublicRoutes);
routeRoutes.get("/details", routeController.getRouteDetails);
routeRoutes.delete(
    "/delete",
    authenticateMiddleware,
    routeController.deleteRoute
);
routeRoutes.get("/search", routeController.searchRoutes);
routeRoutes.post(
    "/update",
    validator(updateRouteValidation),
    authenticateMiddleware,
    routeController.updateRoute
);

export default routeRoutes;
