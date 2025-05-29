import { Router } from "express";
import eventController from "../controllers/eventController.js";
import { validator } from "../middlewares/validator.js";
import { createEventValidation } from "../validations/eventValidations.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";

const eventRoutes = Router();

eventRoutes.post(
    "/create",
    authenticateMiddleware,
    eventController.createEvent
);
eventRoutes.get("/", eventController.getEventById);
eventRoutes.post(
    "/update",
    authenticateMiddleware,
    eventController.updateEvent
);
eventRoutes.delete(
    "/delete",
    authenticateMiddleware,
    eventController.deleteEvent
);
eventRoutes.get("/all", eventController.getAllEvents);
eventRoutes.post("/join", authenticateMiddleware, eventController.joinEvent);
eventRoutes.post("/leave", authenticateMiddleware, eventController.leaveEvent);
eventRoutes.get(
    "/users",
    authenticateMiddleware,
    eventController.getEventUsers
);
eventRoutes.get("/user", authenticateMiddleware, eventController.getUserEvents);
eventRoutes.get(
    "/group/active",
    authenticateMiddleware,
    eventController.getActiveEventByGroupId
);
eventRoutes.delete(
    "/remove-user",
    authenticateMiddleware,
    eventController.removeUserFromEvent
);
eventRoutes.get("/past", eventController.getPastEvents);

export default eventRoutes;
