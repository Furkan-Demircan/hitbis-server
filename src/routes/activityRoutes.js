import { Router } from "express";
import activityController from "../controllers/activityController.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";
import { createActivityValidation } from "../validations/activityValidations.js";
import { validator } from "../middlewares/validator.js";

const activityRoutes = Router();

activityRoutes.post(
    "/log",
    validator(createActivityValidation),
    authenticateMiddleware,
    activityController.logActivity
);

activityRoutes.get(
    "/all",
    authenticateMiddleware,
    activityController.getUserActivities
);

activityRoutes.get(
    "/details",
    authenticateMiddleware,
    activityController.getActivitiyById
);
activityRoutes.get(
    "/summary",
    authenticateMiddleware,
    activityController.getActivitySummary
);

activityRoutes.delete(
    "/delete",
    authenticateMiddleware,
    activityController.deleteActivity
);

export default activityRoutes;
