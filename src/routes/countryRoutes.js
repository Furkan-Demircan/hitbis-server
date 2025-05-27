import { Router } from "express";
import countryController from "../controllers/countryController.js";

const countryRoutes = Router();

countryRoutes.get("/getall", countryController.getAllCountries);

countryRoutes.get("/getCountryCities", countryController.getCountryCities);

export default countryRoutes;
