import { Router } from "express";
import communityController from "../controllers/communityController.js";
import { validator } from "../middlewares/validator.js";
import { createCommunityValidation } from "../validations/communityValidations.js";
import authenticateMiddleware from "../middlewares/authenticationMiddleware.js";

const communityRoutes = Router();

communityRoutes.post(
  "/create",
  validator(createCommunityValidation),
  communityController.createCommunity
);
communityRoutes.get("/groups", communityController.getAllCommunity);
communityRoutes.get("/group", communityController.getCommunityById);
communityRoutes.post(
  "/addUser",
  authenticateMiddleware,
  communityController.addUserToCommunity
);
export default communityRoutes;
