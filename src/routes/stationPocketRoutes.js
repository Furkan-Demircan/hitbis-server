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

export default stationPocketRouter;
