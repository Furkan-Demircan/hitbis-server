import { Router } from "express";
import bikeController from "../controllers/bikeController.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";

const bikeRoutes = Router();

bikeRoutes.post("/create", authenticateMiddleware, bikeController.createBike);
bikeRoutes.get("/details", bikeController.getBikeDetails);

export default bikeRoutes;
