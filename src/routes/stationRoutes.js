import stationController from "../controllers/stationController.js";
import { Router } from "express";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";

const stationRouter = Router();

stationRouter.post(
    "/create",
    authenticateMiddleware,
    stationController.createStation
);
stationRouter.get("/getAll", stationController.getAllStations);
stationRouter.get("/details", stationController.getStationDetails);
stationRouter.get("/capacity", stationController.getStationCapacityStatus);
stationRouter.put(
    "/update",
    authenticateMiddleware,
    stationController.updateStation
);
stationRouter.delete(
    "/delete",
    authenticateMiddleware,
    stationController.deleteStation
);

export default stationRouter;
