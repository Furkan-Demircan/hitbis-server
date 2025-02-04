import { Router } from "express";
import cityController from "../controllers/cityController.js";

const cityRoutes = Router();

cityRoutes.get("/getCity", cityController.getCityByCountryId);

export default cityRoutes;
