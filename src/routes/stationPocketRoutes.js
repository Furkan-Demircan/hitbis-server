import { Router } from "express";
import stationPocketController from "../controllers/stationPocketController.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";

const stationPocketRouter = Router();
stationPocketRouter.post(
    "/create",
    authenticateMiddleware,
    stationPocketController.createPocket
);
stationPocketRouter.get(
    "/get-by-qr",
    authenticateMiddleware,
    stationPocketController.getPocketByQRCode
);
stationPocketRouter.post(
    "/rfid-detected",
    stationPocketController.onRFIDDetected
);
stationPocketRouter.post("/clear", stationPocketController.clearPocket);
stationPocketRouter.get("/available", stationPocketController.getPocketStatus);

export default stationPocketRouter;
