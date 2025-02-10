import { Router } from "express";
import communityController from "../controllers/communityController.js";
import { validator } from "../middlewares/validator.js";
import { createCommunityValidation } from "../validations/communityValidations.js";

const communityRoutes = Router();

communityRoutes.post("/create", validator(createCommunityValidation), communityController.createCommunity);
communityRoutes.get("/groups", communityController.getAllCommunity);
communityRoutes.get("/group", communityController.getCommunityById);
export default communityRoutes;
