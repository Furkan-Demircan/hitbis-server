import { Router } from "express";
import bikeRentalController from "../controllers/bikeRentalController.js";
import { bikeRentalValidation } from "../validations/rentValidations.js";
import { validator } from "../middlewares/validator.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";

const bikeRentalRoutes = Router();

bikeRentalRoutes.post(
    "/rent",
    validator(bikeRentalValidation),
    authenticateMiddleware,
    bikeRentalController.rentBike
);
bikeRentalRoutes.get(
    "/rental-history",
    authenticateMiddleware,
    bikeRentalController.getRentalHistory
);
bikeRentalRoutes.get(
    "/current-rental",
    authenticateMiddleware,
    bikeRentalController.getCurrentRentalStatus
);

export default bikeRentalRoutes;
