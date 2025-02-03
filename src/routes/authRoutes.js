import { Router } from "express";
import { validator } from "../middlewares/validator.js";
import { loginValidation } from "../validations/userValidations.js";
import authController from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/login", validator(loginValidation), authController.loginUser);

export default authRoutes;
