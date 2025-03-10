import { Router } from "express";
import eventController from "../controllers/eventController.js";
import { validator } from "../middlewares/validator.js";
import { createEventValidation } from "../validations/eventValidations.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";

const eventRoutes = Router();

eventRoutes.post(
    "/create",
    authenticateMiddleware,
    validator(createEventValidation),
    eventController.createEvent
);

export default eventRoutes;
