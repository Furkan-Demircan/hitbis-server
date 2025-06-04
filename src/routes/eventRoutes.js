import { Router } from "express";
import eventController from "../controllers/eventController.js";
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
eventRoutes.get("/user/count", eventController.getEventUsersCount);
eventRoutes.get(
    "/isuserinevent",
    authenticateMiddleware,
    eventController.isUserInEvent
);
eventRoutes.get("/isAdmin", authenticateMiddleware, eventController.isAdmin);

export default eventRoutes;
